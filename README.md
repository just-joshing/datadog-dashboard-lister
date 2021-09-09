# Datadog Dashboard Lister action

Retrieves dashboards from the Datadog API filtering them based on keywords in the dashboard names to use in subsequent actions in a workflow.

## Inputs

### `datadog-api-key`
**Required** The Datadog API key to use to retrieve the list of dashboards.

### `datadog-app-key`

**Required** The Datadog APP key to use to retrieve the list of dashboards.

### `filter-titles-by-keywords`
JSON string with an array of terms by which to filter dashboard titles.
Each entry should be a string or an array of strings.
Each entry acts as an "OR" condition.
If an entry is an array, the terms in the array are conditioned together with "AND".

## Outputs

### `dashboards`

JSON string of Datadog dashboards.

## Example usage
```
uses: just-joshing/datadog-dashboard-lister@v1.0
with:
  datadog-api-key: "${{ secrets.DD_API_KEY }}"
  datadog-app-key: "${{ secrets.DD_APP_KEY }}"
```
