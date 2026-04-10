from pathlib import Path


ML_MODELS_DIR = Path(__file__).resolve().parent.parent

DATA_DIR = ML_MODELS_DIR / "data"
RAW_DATA_DIR = DATA_DIR / "raw"
INTERMEDIATE_DATA_DIR = DATA_DIR / "intermediate"
TRAINING_DATA_DIR = DATA_DIR / "training"
REFERENCE_DATA_DIR = DATA_DIR / "reference"

ARTIFACTS_DIR = ML_MODELS_DIR / "artifacts"
CLUSTERS_DIR = ARTIFACTS_DIR / "clusters"
LOGS_DIR = ARTIFACTS_DIR / "logs"

PLOTS_DIR = ARTIFACTS_DIR / "plots"
PROJECTIONS_DIR = PLOTS_DIR / "projections"
EMBEDDINGS_DIR = PLOTS_DIR / "embeddings"
DIAGNOSTICS_DIR = PLOTS_DIR / "diagnostics"
HISTOGRAMS_DIR = PLOTS_DIR / "histograms"

REPORTS_DIR = ML_MODELS_DIR / "reports"


def ensure_output_dirs() -> None:
    for path in (
        RAW_DATA_DIR,
        INTERMEDIATE_DATA_DIR,
        TRAINING_DATA_DIR,
        REFERENCE_DATA_DIR,
        CLUSTERS_DIR,
        LOGS_DIR,
        PROJECTIONS_DIR,
        EMBEDDINGS_DIR,
        DIAGNOSTICS_DIR,
        HISTOGRAMS_DIR,
        REPORTS_DIR,
    ):
        path.mkdir(parents=True, exist_ok=True)
