# Extract and Parse CSV
This is a lambda function that extracts and parses a csv file form google sheets.

### Stream
The file is fetched and handled as a stream.
### Environment Variable
`SHEET_CONFIG` is an encoded base64 json string. Once decoded, it's expeced to have the following schema. The lambda function has this enviroment variable already set.
```json
{
    "id": "SHEET_ID",
    "sheets": ["SHEET_NAME_1", "SHEET_NAME_2"]
}
```

### Fetching Google Sheets
If a Google Sheet is set to be public, you can access it by the following url. We fetch this url for each `sheets` from the `SHEET_CONFIG` json.
```
https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&sheet=${sheet}
```