const Joi = require("joi");

module.exports.listingSchema = Joi.object({

  listing: Joi.object({
    // title
    title: Joi.string().trim().min(5).max(100).required(),

    // description
    description: Joi.string().trim().max(500).allow(""),

    // image
    image: Joi.object({
      // filename
      filename: Joi.string().default("listingimage").required(),

      // url
      url: Joi.string()
        .trim()
        .empty("")
        .default(
          "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=800&q=60",
        )
        .uri({ scheme: ["http", "https"] })
        .required(),
    }).required(),

    // price
    price: Joi.number().min(0).required(),

    // location
    location: Joi.string().trim().required(),

    // country
    country: Joi.string().trim().required(),
  }).required(),
  
});


module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().trim().max(200).allow("", null)
  }).required()
});

