const Joi = require("joi");

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().trim().min(5).max(100).required().messages({
      "string.empty": "Title is Required",
      "string.min": "Title must be atleast 5 characters",
      "string.max": "Title cannot exceed 100 characters",
    }),

    description: Joi.string().trim().max(500).messages({
      "string.max": "Description cannot exceed 500 characters",
    }),

    image: Joi.object({
      filename: Joi.string().default("listingimage"),

      url: Joi.string()
        .trim()
        .empty("") // treat "" as not provided
        .default(
          "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=800&q=60",
        )
        .uri({ scheme: ["http", "https"] })
        .messages({
          "string.uri": "Please enter a valid image URL",
        }),
    }).default(),

    price: Joi.number().min(0).required().messages({
      "number.base": "Price must be a number",
      "number.min": "Price cannot be negative",
      "any.required": "Price is Required",
    }),

    location: Joi.string().trim().required().messages({
      "string.empty": "Location is Required",
    }),

    country: Joi.string().trim().required().messages({
      "string.empty": "Country is Required",
    }),
  }).required(),
});

module.exports = listingSchema;

// const Joi = require("joi");

// const listingSchema = Joi.object({
//   listing: Joi.object({
//     title: Joi.string().trim().min(5).max(100).required(),
//     description: Joi.string().trim().max(500),
//     image: Joi.object({
//       filename: Joi.string().default("listingimage"),
//       url: Joi.string()
//         .trim()
//         .empty()
//         .default(
//           "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=800&q=60",
//         )
//         .set((v) => (v === "" ? undefined : v))
//         .match(/^https?:\/\/.+/i, "Please enter a valid image URL"),
//     }),
//   }).required(),
// });
