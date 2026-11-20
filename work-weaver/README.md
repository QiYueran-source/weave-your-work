# Work Weaver

Work Weaver is a prototype for running `weave-your-work` methods as a composable fast-agent workflow for edge-like environments.

The first slice is intentionally small. It explores three roles:

- `observe`: turn device and work context into structured observations;
- `propose`: draft a verifiable improvement proposal;
- `grill`: challenge the proposal and either accept it, request revision, or escalate to a human.

The prototype uses a bread-oven-shaped example to exercise the workflow contract. It does not yet provide persistent records, HTTP, MCP, real device control, Docker simulation, or autonomous code changes.

`weave-your-work/` remains the source of interactive skills. This directory is a separate runtime prototype that will eventually host adapters and workflow definitions built around those skills.

## Development

The project targets Python 3.11 or newer. Install the package and development dependencies with your preferred environment manager after the dependency choices are finalized.
