# `ml-models`

This folder is organized around the modeling workflow instead of keeping all inputs and generated files in the root.

## Layout

- `data/raw/`: original `.xls` source files
- `data/intermediate/`: preprocessing outputs and normalized variants
- `data/training/`: model-ready training datasets
- `data/reference/`: helper tables such as player names, minutes, and possessions
- `notebooks/`: notebooks grouped by workflow stage
- `artifacts/clusters/`: cluster assignments and cluster summary CSVs
- `artifacts/plots/`: generated plots, grouped by type
- `artifacts/logs/`: text outputs from experiments
- `reports/`: generated score exports and similar report-style outputs

## Conventions

- Keep the root small. New data files and generated outputs should go into one of the folders above.
- Notebooks should import shared paths from `notebooks/paths.py`.
- Use `data/intermediate/` for preprocessing outputs and `data/training/` for datasets that downstream modeling notebooks consume.
- Write generated plots and cluster outputs into `artifacts/` rather than the notebook directory.
