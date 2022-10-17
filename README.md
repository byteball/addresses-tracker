# addresses-tracker

## Project Setup
```sh
npm install
node migration.js
node index.js
```

## API
- */tracked_addresses?from_timestamp=\<timestamp\>&to_timestamp=\<timestamp\>*

Returns all saved addresses in the specified period. If the period is not specified, then the addresses for the last 24 hours will be returned.

```text
[
    {
        "address":"X3STTDL3XXWW7WVSFWWZXZK2WDP72BZ3",
        "creation_date":1666029500588
    }
]
```

