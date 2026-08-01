-- Normalize existing project sort_order to be contiguous and 1-based.
WITH normalized AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY sort_order ASC, created_at ASC) AS next_order
  FROM public.projects
)
UPDATE public.projects p
SET sort_order = n.next_order
FROM normalized n
WHERE p.id = n.id
  AND p.sort_order IS DISTINCT FROM n.next_order;

-- Upsert project while handling optional index insertion/move semantics.
CREATE OR REPLACE FUNCTION public.upsert_project_with_order(
  p_id uuid DEFAULT NULL,
  p_title text DEFAULT NULL,
  p_description text DEFAULT NULL,
  p_image_url text DEFAULT NULL,
  p_tech_stack text[] DEFAULT NULL,
  p_github_url text DEFAULT NULL,
  p_live_url text DEFAULT NULL,
  p_is_private boolean DEFAULT false,
  p_is_visible boolean DEFAULT true,
  p_alt_text text DEFAULT NULL,
  p_flip_preview_text text DEFAULT NULL,
  p_sort_order integer DEFAULT NULL
)
RETURNS public.projects
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
DECLARE
  v_existing public.projects;
  v_result public.projects;
  v_target integer;
  v_max integer;
BEGIN
  IF p_title IS NULL OR btrim(p_title) = '' THEN
    RAISE EXCEPTION 'Project title is required';
  END IF;

  SELECT * INTO v_existing
  FROM public.projects
  WHERE id = p_id
  FOR UPDATE;

  SELECT COALESCE(MAX(sort_order), 0) INTO v_max FROM public.projects;

  IF v_existing.id IS NULL THEN
    IF p_sort_order IS NULL THEN
      v_target := v_max + 1;
    ELSE
      v_target := GREATEST(1, LEAST(p_sort_order, v_max + 1));
      UPDATE public.projects
      SET sort_order = sort_order + 1
      WHERE sort_order >= v_target;
    END IF;

    INSERT INTO public.projects (
      title,
      description,
      image_url,
      tech_stack,
      github_url,
      live_url,
      is_private,
      is_visible,
      alt_text,
      flip_preview_text,
      sort_order
    )
    VALUES (
      p_title,
      p_description,
      p_image_url,
      COALESCE(p_tech_stack, '{}'::text[]),
      p_github_url,
      p_live_url,
      COALESCE(p_is_private, false),
      COALESCE(p_is_visible, true),
      p_alt_text,
      p_flip_preview_text,
      v_target
    )
    RETURNING * INTO v_result;

    RETURN v_result;
  END IF;

  IF p_sort_order IS NULL THEN
    v_target := v_existing.sort_order;
  ELSE
    v_target := GREATEST(1, LEAST(p_sort_order, v_max));
  END IF;

  IF v_target < v_existing.sort_order THEN
    UPDATE public.projects
    SET sort_order = sort_order + 1
    WHERE id <> v_existing.id
      AND sort_order >= v_target
      AND sort_order < v_existing.sort_order;
  ELSIF v_target > v_existing.sort_order THEN
    UPDATE public.projects
    SET sort_order = sort_order - 1
    WHERE id <> v_existing.id
      AND sort_order <= v_target
      AND sort_order > v_existing.sort_order;
  END IF;

  UPDATE public.projects
  SET
    title = p_title,
    description = p_description,
    image_url = p_image_url,
    tech_stack = COALESCE(p_tech_stack, '{}'::text[]),
    github_url = p_github_url,
    live_url = p_live_url,
    is_private = COALESCE(p_is_private, false),
    is_visible = COALESCE(p_is_visible, true),
    alt_text = p_alt_text,
    flip_preview_text = p_flip_preview_text,
    sort_order = v_target
  WHERE id = v_existing.id
  RETURNING * INTO v_result;

  RETURN v_result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_project_with_order(
  uuid,
  text,
  text,
  text,
  text[],
  text,
  text,
  boolean,
  boolean,
  text,
  text,
  integer
) TO authenticated;

-- Keep sort_order contiguous after deletes.
CREATE OR REPLACE FUNCTION public.reindex_projects_after_delete()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.projects
  SET sort_order = sort_order - 1
  WHERE sort_order > OLD.sort_order;

  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS projects_reindex_after_delete ON public.projects;
CREATE TRIGGER projects_reindex_after_delete
AFTER DELETE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.reindex_projects_after_delete();
