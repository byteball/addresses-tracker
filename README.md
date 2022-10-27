# addresses-tracker

## Project Setup
```sh
npm install
node index.js
```

## API
- */tracked_addresses?from_date=\<datetime\>&to_date=\<datetime\>*

datetime is supported in two formats: "2022-01-22 03:21" and "2022-01-22"

```text
[
    {
        "address": "IUPXOQ5ZP3OYEOVOUTLEMO5CENMKZGYW",
        "creation_date": "2022-10-12 06:56:21"
    }
]
```

