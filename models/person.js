const mongoose = require("mongoose")

mongoose.set("strictQuery", false)
const URL = process.env.MONGODB_URI

console.log("connecting to ", URL);

mongoose.connect(URL)
    .then(result => {
        console.log("connected to MongoDB")
    })
    .catch((err) => {
        console.log("error connecting to MongoDB", err.message);
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    number: {
        type: String,
        minlength: 8,
        validate: {
            validator: (s) => {
                return /\d{2,3}-\d{5,}/.test(s)
            },
            message: props => `${props.value} is not a valid number`
        }
    }
})

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model("Person", personSchema)