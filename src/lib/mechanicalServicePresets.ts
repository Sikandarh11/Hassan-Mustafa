export type MechanicalServicePreset = {
  key: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  capabilities: string[];
  tools: string[];
  standards?: string[];
  deliverables: string[];
  turnaround: string;
  engagement_type: string;
  is_featured: boolean;
  cta_label?: string;
  cta_url?: string;
};

export const MECHANICAL_SERVICE_PRESETS: MechanicalServicePreset[] = [
  {
    key: "parametric-cad",
    title: "Parametric 3D CAD Modelling",
    category: "Design",
    description: "Production-ready part and assembly models built for clear design intent and easy revision.",
    icon: "box",
    capabilities: ["Parts and assemblies", "Design configurations", "Top-down and bottom-up modelling"],
    tools: ["SOLIDWORKS", "Autodesk Inventor", "Fusion 360", "Creo"],
    standards: ["ASME Y14.5", "ISO 2768"],
    deliverables: ["Native CAD files", "STEP / Parasolid exports", "Exploded views"],
    turnaround: "2-7 business days",
    engagement_type: "Project-based",
    is_featured: true,
  },
  {
    key: "machine-design",
    title: "Machine & Mechanism Design",
    category: "Design",
    description: "Practical mechanisms, fixtures, and machine subassemblies designed around loads, motion, safety, and maintainability.",
    icon: "cog",
    capabilities: ["Mechanism layout", "Bearing and shaft selection", "Tolerance and fit definition"],
    tools: ["SOLIDWORKS", "Inventor", "KISSsoft", "Excel"],
    standards: ["ISO 12100", "ISO 286", "AGMA"],
    deliverables: ["Assembly model", "Design calculations", "Bill of materials"],
    turnaround: "1-3 weeks",
    engagement_type: "Project-based",
    is_featured: true,
  },
  {
    key: "drawings-gdt",
    title: "Manufacturing Drawings & GD&T",
    category: "Documentation",
    description: "Clear, standards-based drawings that communicate dimensions, tolerances, finishes, and inspection requirements.",
    icon: "ruler",
    capabilities: ["Detail and assembly drawings", "Tolerance stacks", "ASME Y14.5 / ISO GD&T"],
    tools: ["SOLIDWORKS Drawings", "AutoCAD", "Inventor"],
    standards: ["ASME Y14.5", "ISO 1101", "ISO 2768"],
    deliverables: ["PDF and DWG drawings", "Inspection dimensions", "Drawing register"],
    turnaround: "1-5 business days",
    engagement_type: "Fixed scope",
    is_featured: false,
  },
  {
    key: "fea-validation",
    title: "FEA & Design Validation",
    category: "Analysis",
    description: "Simulation-led checks that identify stress, deformation, thermal, and buckling risks before manufacture.",
    icon: "chart",
    capabilities: ["Static structural analysis", "Modal and buckling checks", "Design iteration support"],
    tools: ["ANSYS", "SOLIDWORKS Simulation", "Abaqus"],
    standards: ["ASME V&V 10", "EN 1993"],
    deliverables: ["Simulation report", "Result plots", "Improvement recommendations"],
    turnaround: "3-10 business days",
    engagement_type: "Analysis package",
    is_featured: true,
  },
  {
    key: "dfm-dfa",
    title: "DFM/DFA & Production Support",
    category: "Manufacturing",
    description: "Design reviews focused on cost, manufacturability, assembly effort, quality, and supplier readiness.",
    icon: "wrench",
    capabilities: ["Machining and fabrication review", "Assembly simplification", "Cost-down recommendations"],
    tools: ["DFM checklists", "CAD markup", "Tolerance analysis"],
    standards: ["ISO 9001", "Supplier specifications"],
    deliverables: ["DFM report", "Revised CAD", "Supplier-ready package"],
    turnaround: "2-7 business days",
    engagement_type: "Consulting",
    is_featured: false,
  },
  {
    key: "reverse-engineering",
    title: "Reverse Engineering",
    category: "Design",
    description: "Accurate reconstruction of legacy or physical components into clean, editable CAD and drawing packages.",
    icon: "scan",
    capabilities: ["Measurement planning", "Mesh-to-CAD reconstruction", "Legacy drawing conversion"],
    tools: ["Geomagic Design X", "SOLIDWORKS", "3D scanning"],
    standards: ["ASME Y14.5", "ISO 2768"],
    deliverables: ["Editable CAD model", "Manufacturing drawing", "Deviation summary"],
    turnaround: "3-10 business days",
    engagement_type: "Project-based",
    is_featured: false,
  },
  {
    key: "sheet-metal-weldments",
    title: "Sheet Metal & Weldment Design",
    category: "Manufacturing",
    description: "Fabrication-aware enclosures, frames, guards, and structures with practical bends, joints, and cut lists.",
    icon: "layers",
    capabilities: ["Flat-pattern development", "Frame and weldment design", "Bend and joint detailing"],
    tools: ["SOLIDWORKS", "Inventor", "AutoCAD"],
    standards: ["AWS D1.1", "ISO 2553", "DIN 6935"],
    deliverables: ["DXF flat patterns", "Cut lists", "Fabrication drawings"],
    turnaround: "3-10 business days",
    engagement_type: "Project-based",
    is_featured: false,
  },
  {
    key: "product-development",
    title: "Product Development & Prototyping",
    category: "Development",
    description: "Concept-to-prototype engineering with structured iteration, supplier communication, and design verification.",
    icon: "lightbulb",
    capabilities: ["Concept development", "Prototype iteration", "Design verification planning"],
    tools: ["CAD", "Rapid prototyping", "BOM tools"],
    standards: ["ISO 12100", "ISO 9001"],
    deliverables: ["Concept package", "Prototype-ready CAD", "Verification checklist"],
    turnaround: "2-6 weeks",
    engagement_type: "Milestone-based",
    is_featured: true,
  },
];

export const MECHANICAL_SERVICE_CATEGORIES = [
  "Design",
  "Analysis",
  "Documentation",
  "Manufacturing",
  "Development",
  "Consulting",
];

export const MECHANICAL_SERVICE_ICONS = [
  { value: "cog", label: "Gear / mechanism" },
  { value: "box", label: "3D CAD model" },
  { value: "ruler", label: "Drawings / GD&T" },
  { value: "chart", label: "Analysis / FEA" },
  { value: "wrench", label: "Manufacturing / DFM" },
  { value: "scan", label: "Reverse engineering" },
  { value: "layers", label: "Sheet metal / weldments" },
  { value: "lightbulb", label: "Product development" },
];
