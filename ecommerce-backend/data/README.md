# RapidMiner Recommendation Data

1. Login as an admin and download `GET /api/analytics/export-orders`.
2. Import the CSV into RapidMiner.
3. Use FP-Growth followed by Create Association Rules.
4. Export the rules as JSON with this shape:

```json
{
  "PRODUCT_ID": [
    { "product": "RELATED_PRODUCT_ID", "confidence": 0.82 }
  ]
}
```

5. Save the generated JSON as `associationRules.json` in this directory.
6. Restart the backend and test `GET /api/analytics/recommendations/:productId`.

The checked-in empty JSON file is intentional until real order data is processed through RapidMiner; the API uses content-based fallback recommendations meanwhile.
