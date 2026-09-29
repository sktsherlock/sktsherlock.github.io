# MAGB / KDD 2025 figure update

Checked 2026-09-29.

## Replacement image

- Asset: `images/homepage/magb-gnn-predictor-arxiv-v2.png`
- Source: https://arxiv.org/pdf/2410.09132v2
- Figure 2, PDF page 3: **Overview of GNN-as-Predictor**.
- Source version: arXiv v2, submitted 27 February 2025; the most recent arXiv version listed on the abstract page at this check.
- Extraction: rendered the original vector artwork from the source PDF at 6 pixels per point, excluding the paper caption and surrounding body text. No scientific content was redrawn or modified.
- Output: 1458 x 1116 px, 517,790 bytes, PNG. Inspected visually at full resolution: complete panel borders, arrows, labels, graph and task boxes retained.
- Reproducible PDF crop: page index 2, PDFium crop `(left=316, bottom=524, right=53, top=82)` points on a 612 x 792 pt page.
- Suggested alt text: "MAGB GNN-as-Predictor: text, image and vision-language encoders produce node features, which a graph neural network uses for node classification and link prediction."

## What changed from the old thumbnail

The existing `images/MAG.jpg` depicts the earlier three-panel attribute/topology/MAG overview corresponding to the October 2024 v1 design. The February 2025 v2 reorganizes the paper around two prediction paradigms and contains distinct new figures: Figure 1 (MAG data example, page 2), Figure 2 (GNN-as-Predictor, page 3), and Figure 3 (VLM-as-Predictor, page 4). Figure 2 is the recommended replacement because it conveys the benchmark's encoders, multimodal representations, graph processing and two downstream tasks in one self-contained panel.

## Paper content for homepage

Suggested short description:

> Five multimodal graph datasets and a unified evaluation of GNN-as-Predictor and VLM-as-Predictor, revealing how domain, modality imbalance and graph retrieval affect representation learning and zero-shot prediction.

The paper benchmarks three Amazon networks (Movies, Toys, Grocery) and two Reddit networks (Reddit-S, Reddit-M). It compares text, image and multimodal encoders for GNN node classification/link prediction, and tests center-only and neighbor-augmented VLM zero-shot classification. Results show that useful modalities depend on domain, simple feature concatenation can amplify imbalance, VLM embeddings often help, and neighbor retrieval is not uniformly beneficial. Avoid claiming that every multimodal setting or every retrieval setting improves performance.

## Provenance and version limit

- Latest public preprint: https://arxiv.org/abs/2410.09132v2
- Rendered HTML artwork: https://arxiv.org/html/2410.09132v2/MEGNN-New.png
- Author repository linked by the paper: https://github.com/sktsherlock/MAGB
- Publisher record: https://doi.org/10.1145/3711896.3737404
- Previous version for comparison: https://arxiv.org/html/2410.09132v1

The publisher record confirms the KDD 2025 publication and the final title, **When Graph Meets Multimodal: Benchmarking and Meditating on Multimodal Attributed Graph Learning** (singular "Graph"). The publisher PDF and full-text endpoints returned HTTP 403 in this environment. Therefore the new artwork is verified against the author's latest public preprint, but has not been compared directly with the publisher's final PDF. Do not label the asset as a verified final-publisher figure.
