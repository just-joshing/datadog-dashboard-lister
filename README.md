# Datadog Dashboard Lister action

This action prints "Hello World" or "Hello" + the name of a person to greet to the log.

## Inputs

### `datadog-api-key`
**Required** The Datadog API key to use to retrieve the list of dashboards.

### `datadog-app-key`

**Required** The Datadog APP key to use to retrieve the list of dashboards.

## Outputs

### `time`

The time we greeted you.

## Example usage

uses: just-joshing/datadog-dashboard-lister@v1.0
with:
  datadog-api-key: "${{ secrets.DD_API_KEY }}"
  datadog-app-key: "${{ secrets.DD_APP_KEY }}"