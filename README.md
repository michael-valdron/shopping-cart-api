# Shopping Cart API

RESTful APIs demo for performing CRUD requests on a Shopping Cart database.

Live preview of this RESTful API can be used on [Heroku](https://mv-shopping-cart-api.herokuapp.com/), see [usage](#usage) for details.

Documentation on the source code can be found [here](https://michaelvaldron.ca/shopping-cart-api).

## Dependencies

The following includes all base dependencies for running the API
backend:

- NodeJS `12.22.1`
- Yarn `1.22`+
- PostgeSQL Database (`12`+ recommended)

Optionally for using a PostgreSQL container in development:
- `docker`
- `docker-compose`

All project dependencies can be fetch by `yarn install` or `npm install`. Project dependencies are specified and listed under `package.json`.

## Configuration

Some configuration is needed to be set by environment variables.

### Environment Variables

Here is a list of environments variables to set:

- `DATABASE_URL`: A URL to the backend PostgreSQL database for use by the APIs, example format: '`postgres://[user]:[password]@[hostname]:[port]/[dbname]`'
- `SSL` (Optional): If set to any value, the API service will use an SSL enabled connection to `DATABASE_URL` specified.
- `PGPORT` (For `docker-compose` DB only): Specifies the port number to use on PostgreSQL `docker` container.
- `PGPASSWORD` (For `docker-compose` DB and DB access only): Specifies password to use for the `postgres` user in `docker` container, also allows for passwordless access to a `psql` connection for management.

## Usage

### Yarn Commands

Ensure there is a target PostgreSQL database running with the `DATABASE_URL` environment variable set to its url **before** running API service, *even in development*.

To run service in development mode (watching for file changes) run the following:

```bash
    yarn watch
```

To build production JavaScript for NodeJS deployment run the following:

```bash
    yarn build
```

To clean built production source run:

```bash
    yarn clean
```

To run production service (in project folder) run:

```bash
    yarn start
```

**Note**: `yarn build` must be ran before `yarn start`.

### API Requests

- `PUT /api/v1/add`: Creates records in database for items and parent cart from JSON repersentation of a cart shown below:

**With Discount**
```js
{
    "discount": 0.1, // 10%
    "items": [
        {
            "label": "Milk",
            "price": 2.99
        },
        {
            "label": "Cereal",
            "price": 3.99
        },
        ...
    ]
}
```

**Without Discount**
```js
{
    "items": [
        {
            "label": "Milk",
            "price": 2.99
        },
        {
            "label": "Cereal",
            "price": 3.99
        },
        ...
    ]
}
```
**Note**: When carts and items are created, unique identifiers are 
generated within PostgeSQL. `subtotal` and `total` are calculated off
of each item `price`, the total tax amount (`taxes`), and the discount
percentage (`discount`). `taxes` is calculated from another relational
called `tax` which contains all tax percentages to compute against the
`subtotal`.

- `GET /api/v1/view/cart/id`: Fetches all unique identifiers of shopping carts from backend database and returns a JSON array response, example:
```js
[1, 2, 3, 4, 5, ...]
```

**Note**: If cart records are not found, the above request will return an empty JSON array.

- `GET /api/v1/view/cart/[id]`: Fetches a cart record by given unique identifier `id` from backend database and returns a JSON object with all data on cart record and an array of JSON object with data on all attached item records, example:
```js
{
    "id": 1,
    "subtotal": 6.98,
    "discount": 0,
    "taxes": 0.91, // Computed off of Canadian HST tax
    "total": 7.89,
    "items": [
        {
            "label": "Milk",
            "price": 2.99
        },
        {
            "label": "Cereal",
            "price": 3.99
        }
    ]
}
```

**Note**: If the cart record is not found, the above request will return an empty JSON object.

- `GET /api/v1/view/item/id`: Fetches all unique identifiers of shopping cart items from backend database and returns a JSON array response.

**Note**: If item records are not found, the above request will return an empty JSON array.

- `POST /api/v1/edit/cart/[id]`: Updates a cart record by given unique identifier `id` and updated to values specified by a passed JSON object with their attributes. For updating carts only the `discount` attribute can be updated as others are prevented by constraint(s) or are calculated. Returns a JSON object with all data on cart record. Example of input data:

```js
{
    "discount": 0.2 // updates current discount to 20%
}
```
**Note**: If the cart record is not found, the above request will return a 
404 error with a JSON object with details.

- `POST /api/v1/edit/item/[id]`: Updates an item record by given unique identifier `id` and updated to values specified by a passed JSON object with their attributes. For updating items only the `label` and `price` attribute can be updated. Updating the `price` will also update the `subtotal`, `taxes`, and `total` attributes in the attached cart record. Returns a JSON object with all data on item record. Examples of input data:

**Updating Label**
```json
{
    "label": "Apple"
}
```

**Updating Price**
```json
{
    "price": 4.99
}
```

**Updating Both**
```json
{
    "label": "Apple",
    "price": 4.99 
}
```

**Note**: If the item record is not found, the above request will return a 
404 error with a JSON object with details.

- `DELETE /api/v1/checkout/cart/[id]`: Deletes a cart record and all associated item records for a given cart `id`. Returns a JSON object with all data on cart record and an array of JSON object with data on all attached item records.

**Note**: If the cart record is not found, the above request will return a 
404 error with a JSON object with details.

#### General API Errors

When error responses happen, the following JSON object is returned:

```json
{
    "status": "error",
    "message": "<error message with details>"
}
```

- **404 Not Found**: This happens when either an API URL does not exist or in some cases (mentioned above) there are no records that match a given `id`.

- **400 Bad Request**: This either means that some input data passed was invalid or the request method is incorrect for a specific URI section. Examples:
    - `GET /api/v1/view/cart/a`
    - `DELETE /api/v1/add`
    - `POST /api/v1/edit/cart/1` with passed `{ "foo": bar }`

- **500 Internal Server**: This happens when something is wrong with database connectivity or query execution. When this happens, ensure that the target instance of PostgreSQL is running, `DATABASE_URL` environment variable is set to the target correctly, and all barriers to make the connect are down (i.e. firewalls, open ports). It is also worth checking the server console for details when this happens. If you are a user, contact the server administrator to report this issue.

## How to test the software

As with running the service, ensure there is a target PostgreSQL database running with the `DATABASE_URL` environment variable set to its url **before** running the tests.

Unit tests can be ran using the following:

```
    yarn test
```

## MIT Licence

See [LICENSE](LICENSE) licence details.
