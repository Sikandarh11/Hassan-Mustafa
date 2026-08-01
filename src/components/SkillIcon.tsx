import { useState } from "react";

const SLUG_MAP: Record<string, string> = {
  "C++": "cplusplus",
  "C#": "csharp",
  "Python": "python",
  "PyTorch": "pytorch",
  "TensorFlow": "tensorflow",
  "scikit-learn": "scikit-learn",
  "LangChain": "langchain",
  "FastAPI": "fastapi",
  "MongoDB": "mongodb",
  "PostgreSQL": "postgresql",
  "Docker": "docker",
  "Azure": "microsoftazure",
  "AWS": "amazonaws",
  "Google Cloud": "googlecloud",
  "GitHub": "github",
  "GitLab": "gitlab",
  "Git": "git",
  "React": "react",
  "Linux": "linux",
  "Java": "java",
  "MLflow": "mlflow",
  "Flask": "flask",
  "SQL": "postgresql",
};

const NO_ICON_NAMES = new Set([
  "CI/CD", "REST APIs", "Tool-Calling", "Workflow Automation", "LSTMs",
  "CNNs", "RAG", "NLP", "Deployment", "TorchServe", "DVC", "OOP",
  "GitGraph", "Vector Databases", "LangGraph", "REST API Integration",
  "Embeddings", "Feature Engineering",
]);

type State = "custom" | "simpleicons" | "devicons" | "text";

function getSlug(name: string): string | null {
  if (NO_ICON_NAMES.has(name)) return null;
  if (SLUG_MAP[name] !== undefined) return SLUG_MAP[name];
  const generated = name.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
  return generated || null;
}

function getUrl(state: State, slug: string | null, logoUrl?: string | null): string | null {
  if (state === "custom" && logoUrl) return logoUrl;
  if (!slug) return null;
  if (state === "simpleicons") return `https://cdn.simpleicons.org/${slug}`;
  if (state === "devicons") return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-original.svg`;
  return null;
}

interface SkillIconProps {
  name: string;
  logoUrl?: string | null;
}

const SkillIcon = ({ name, logoUrl }: SkillIconProps) => {
  const slug = getSlug(name);

  const initialState: State = logoUrl ? "custom" : slug ? "simpleicons" : "text";
  const [state, setState] = useState<State>(initialState);

  const advance = () => {
    if (state === "custom") setState(slug ? "simpleicons" : "text");
    else if (state === "simpleicons") setState("devicons");
    else setState("text");
  };

  if (state === "text") {
    return (
      <div
        className="flex items-center justify-center rounded-lg border border-primary/25 bg-secondary"
        style={{ width: 32, height: 32 }}
      >
        <span className="font-display text-[11px] text-primary">
          {name.slice(0, 2).toUpperCase()}
        </span>
      </div>
    );
  }

  const src = getUrl(state, slug, logoUrl);
  if (!src) {
    return (
      <div
        className="flex items-center justify-center rounded-lg border border-primary/25 bg-secondary"
        style={{ width: 32, height: 32 }}
      >
        <span className="font-display text-[11px] text-primary">
          {name.slice(0, 2).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src!}
      alt={name}
      width={32}
      height={32}
      loading="lazy"
      onError={advance}
      className="object-contain"
      style={{
        width: 32,
        height: 32,
        filter: "brightness(0) saturate(100%) invert(72%) sepia(98%) saturate(400%) hue-rotate(145deg)",
      }}
    />
  );
};

export default SkillIcon;
