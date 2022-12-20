# project5

# Project - Products Management
# Key points

    In this project we will work feature wise. That means we pick one object like user, book, blog, etc at a time. We work through it's feature. The steps would be:
        We create it's model.
        We build it's APIs.
        We test these APIs.
        We deploy these APIs.
        We integrate these APIs with frontend.
        We will repeat steps from Step 1 to Step 5 for each feature in this project.
    This project is divided into 4 features namely User, Product, Cart and Order. You need to work on a single feature at a time. Once that is completed as per above mentioned steps. You will be instructed to move to next Feature.
    In this project we are changing how we send token with a request. Instead of using a custom header key like x-api-key, you need to use Authorization header and send the JWT token as Bearer token.
    Create a group database groupXDatabase. You can clean the db you previously used and resue that.
    This time each group should have a single git branch. Coordinate amongst yourselves by ensuring every next person pulls the code last pushed by a team mate. You branch will be checked as part of the demo. Branch name should follow the naming convention project/productsManagementGroupX
    Follow the naming conventions exactly as instructed.

# FEATURE I - User
# Models

   # User Model

{ 
  fname: {string, mandatory},
  lname: {string, mandatory},
  email: {string, mandatory, valid email, unique},
  profileImage: {string, mandatory}, // s3 link
  phone: {string, mandatory, unique, valid Indian mobile number}, 
  password: {string, mandatory, minLen 8, maxLen 15}, // encrypted password
  address: {
    shipping: {
      street: {string, mandatory},
      city: {string, mandatory},
      pincode: {number, mandatory}
    },
    billing: {
      street: {string, mandatory},
      city: {string, mandatory},
      pincode: {number, mandatory}
    }
  },
  createdAt: {timestamp},
  updatedAt: {timestamp}
}

# User APIs
# POST /register

    Create a user document from request body. Request body must contain image.
    Upload image to S3 bucket and save it's public url in user document.
    Save password in encrypted format. (use bcrypt)
    Response format
        On success - Return HTTP status 201. Also return the user document. The response should be a JSON object like this
        On error - Return a suitable error message with a valid HTTP status code. The response should be a JSON object like this

{
    "status": true,
    "message": "User created successfully",
    "data": {
        "fname": "John",
        "lname": "Doe",
        "email": "johndoe@mailinator.com",
        "profileImage": "https://classroom-training-bucket.s3.ap-south-1.amazonaws.com/user/copernico-p_kICQCOM4s-unsplash.jpg",
        "phone": 9876543210,
        "password": "$2b$10$DpOSGb0B7cT0f6L95RnpWO2P/AtEoE6OF9diIiAEP7QrTMaV29Kmm",
        "address": {
            "shipping": {
                "street": "MG Road",
                "city": "Indore",
                "pincode": 452001
            },
            "billing": {
                "street": "MG Road",
                "city": "Indore",
                "pincode": 452001
            }
        },
        "_id": "6162876abdcb70afeeaf9cf5",
        "createdAt": "2021-10-10T06:25:46.051Z",
        "updatedAt": "2021-10-10T06:25:46.051Z",
        "__v": 0
    }
}

# POST /login

    Allow an user to login with their email and password.
    On a successful login attempt return the userId and a JWT token contatining the userId, exp, iat.

    NOTE: There is a slight change in response body. You should also return userId in addition to the JWT token.

    Response format
        On success - Return HTTP status 200 and JWT token in response body. The response should be a JSON object like this
        On error - Return a suitable error message with a valid HTTP status code. The response should be a JSON object like this

{
    "status": true,
    "message": "User login successfull",
    "data": {
        "userId": "6165f29cfe83625cf2c10a5c",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTYyODc2YWJkY2I3MGFmZWVhZjljZjUiLCJpYXQiOjE2MzM4NDczNzYsImV4cCI6MTYzMzg4MzM3Nn0.PgcBPLLg4J01Hyin-zR6BCk7JHBY-RpuWMG_oIK7aV8"
    }
}

# GET /user/:userId/profile (Authentication required)

    Allow an user to fetch details of their profile.
    Make sure that userId in url param and in token is same
    Response format
        On success - Return HTTP status 200 and returns the user document. The response should be a JSON object like this
        On error - Return a suitable error message with a valid HTTP status code. The response should be a JSON object like this

{
    "status": true,
    "message": "User profile details",
    "data": {
        "address": {
            "shipping": {
                "street": "MG Road",
                "city": "Indore",
                "pincode": 452001
            },
            "billing": {
                "street": "MG Road",
                "city": "Indore",
                "pincode": 452001
            }
        },
        "_id": "6162876abdcb70afeeaf9cf5",
        "fname": "John",
        "lname": "Doe",
        "email": "johndoe@mailinator.com",
        "profileImage": "https://classroom-training-bucket.s3.ap-south-1.amazonaws.com/user/copernico-p_kICQCOM4s-unsplash.jpg",
        "phone": 9876543210,
        "password": "$2b$10$DpOSGb0B7cT0f6L95RnpWO2P/AtEoE6OF9diIiAEP7QrTMaV29Kmm",
        "createdAt": "2021-10-10T06:25:46.051Z",
        "updatedAt": "2021-10-10T06:25:46.051Z",
        "__v": 0
    }
}

# PUT /user/:userId/profile (Authentication and Authorization required)

    Allow an user to update their profile.
    A user can update all the fields
    Make sure that userId in url param and in token is same
    Response format
        On success - Return HTTP status 200. Also return the updated user document. The response should be a JSON object like this
        On error - Return a suitable error message with a valid HTTP status code. The response should be a JSON object like this

{
    "status": true,
    "message": "User profile updated",
    "data": {
        "address": {
            "shipping": {
                "street": "MG Road",
                "city": "Delhi",
                "pincode": 110001
            },
            "billing": {
                "street": "MG Road",
                "city": "Indore",
                "pincode": 452010
            }
        },
        "_id": "6162876abdcb70afeeaf9cf5",
        "fname": "Jane",
        "lname": "Austin",
        "email": "janedoe@mailinator.com",
        "profileImage": "https://classroom-training-bucket.s3.ap-south-1.amazonaws.com/user/laura-davidson-QBAH4IldaZY-unsplash.jpg",
        "phone": 9876543210,
        "password": "$2b$10$jgF/j/clYBq.3uly6Tijce4GEGJn9EIXEcw9NI3prgKwJ/6.sWT6O",
        "createdAt": "2021-10-10T06:25:46.051Z",
        "updatedAt": "2021-10-10T08:47:15.297Z",
        "__v": 0
    }
}

# FEATTURE II - Product
# Models

    # Product Model

{ 
  title: {string, mandatory, unique},
  description: {string, mandatory},
  price: {number, mandatory, valid number/decimal},
  currencyId: {string, mandatory, INR},
  currencyFormat: {string, mandatory, Rupee symbol},
  isFreeShipping: {boolean, default: false},
  productImage: {string, mandatory},  // s3 link
  style: {string},
  availableSizes: {array of string, at least one size, enum["S", "XS","M","X", "L","XXL", "XL"]},
  installments: {number},
  deletedAt: {Date, when the document is deleted}, 
  isDeleted: {boolean, default: false},
  createdAt: {timestamp},
  updatedAt: {timestamp},
}

# Products API (No authentication required)
# POST /products

    Create a product document from request body.
    Upload product image to S3 bucket and save image public url in document.
    Response format
        On success - Return HTTP status 201. Also return the product document. The response should be a JSON object like this
        On error - Return a suitable error message with a valid HTTP status code. The response should be a JSON object like this

# GET /products

    Returns all products in the collection that aren't deleted.
        Filters
            Size (The key for this filter will be 'size')
            Product name (The key for this filter will be 'name'). You should return all the products with name containing the substring recieved in this filter
            Price : greater than or less than a specific value. The keys are 'priceGreaterThan' and 'priceLessThan'.

    NOTE: For price filter request could contain both or any one of the keys. For example the query in the request could look like { priceGreaterThan: 500, priceLessThan: 2000 } or just { priceLessThan: 1000 } )

    Sort
        Sorted by product price in ascending or descending. The key value pair will look like {priceSort : 1} or {priceSort : -1} eg /products?size=XL&name=Nit%20grit
    Response format
        On success - Return HTTP status 200. Also return the product documents. The response should be a JSON object like this
        On error - Return a suitable error message with a valid HTTP status code. The response should be a JSON object like this

# GET /products/:productId

    Returns product details by product id
    Response format
        On success - Return HTTP status 200. Also return the product documents. The response should be a JSON object like this
        On error - Return a suitable error message with a valid HTTP status code. The response should be a JSON object like this

# PUT /products/:productId

    Updates a product by changing at least one or all fields
    Check if the productId exists (must have isDeleted false and is present in collection). If it doesn't, return an HTTP status 404 with a response body like this
    Response format
        On success - Return HTTP status 200. Also return the updated product document. The response should be a JSON object like this
        On error - Return a suitable error message with a valid HTTP status code. The response should be a JSON object like this

# DELETE /products/:productId

    Deletes a product by product id if it's not already deleted
    Response format
        On success - Return HTTP status 200. The response should be a JSON object like this
        On error - Return a suitable error message with a valid HTTP status code. The response should be a JSON object like this
