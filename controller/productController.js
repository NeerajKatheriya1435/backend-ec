import fs from "fs"
import slugify from "slugify"
import productModel from "../models/productModel.js"
import catModel from "../models/categoryModel.js"
import orderModel from "../models/orderModel.js"
import braintree from "braintree"
import dotenv from "dotenv"

dotenv.config()

var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity } = req.fields
        const { photo } = req.files
        if (!name || !description || !price || !category || !quantity || !photo) {
            return res.status(400).send({
                success: false,
                message: "All fields are required",
            })
        }
        if (photo.size > 200000) {
            return res.status(400).send({
                success: false,
                message: "Photo should not be more than 2 mb",
            })
        }
        const product = new productModel({ ...req.fields, slug: slugify(name) })

        if (photo) {
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }
        await product.save()
        return res.status(201).send({
            success: true,
            message: "Created product successfully",
            product
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            error,
            success: false,
            message: "Error while creating product"
        })
    }
}

export const getAllProduct = async (req, res) => {
    try {
        const allProduct = await productModel.find({}).select("-photo").limit(10).sort({ createdAt: -1 }).populate("category")
        return res.status(200).send({
            success: true,
            message: "Fetched all products",
            totalProduct: allProduct.length,
            allProduct
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            error,
            success: false,
            message: "Error while fetching all product"
        })
    }
}

//get single product
export const getSingleProduct = async (req, res) => {
    try {
        const singleProduct = await productModel.findOne({ slug: req.params.slug }).select("-photo").populate("category")
        return res.status(200).send({
            success: true,
            message: "Fetched single product",
            singleProduct
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            error,
            success: false,
            message: "Error while fetching product"
        })
    }
}
// get product photo
export const getProductPhoto = async (req, res) => {
    try {
        const productPhoto = await productModel.findById(req.params.pid).select('photo')
        if (productPhoto.photo.data) {
            res.set("Content-type", productPhoto.photo.contentType)
        }
        return res.status(200).send(productPhoto.photo.data)
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            error,
            success: false,
            message: "Error while fetching product photo"
        })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo")
        return res.status(200).send({
            success: true,
            message: "Deleted product successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            error,
            success: false,
            message: "Error while deleting product photo"
        })
    }
}
export const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, quantity } = req.fields
        const { photo } = req.files
        if (!name || !description || !price || !category || !quantity) {
            return res.status(400).send({
                success: false,
                message: "All fields are required",
            })
        }
        if (photo && photo.size > 200000) {
            return res.status(400).send({
                success: false,
                message: "Photo should not be more than 2 mb",
            })
        }
        const product = await productModel.findByIdAndUpdate(req.params.pid, {
            ...req.fields, slug: slugify(name)
        }, { new: true }
        )

        if (photo) {
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }
        await product.save()
        return res.status(201).send({
            success: true,
            message: "Updated product successfully",
            product
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            error,
            success: false,
            message: "Error while updating product"
        })
    }
}

//filter by category
export const productFilter = async (req, res) => {
    try {
        const { checked, radio } = req.body;
        let args = {};
        if (checked.length > 0) args.category = checked
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] }
        const filterProducts = await productModel.find(args);
        res.status(200).send({
            success: true,
            filterProducts
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while fething via filters",
        })
    }
}

//count products
export const countProduct = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount()
        res.status(200).send({
            success: true,
            total
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while fething count products"
        })
    }
}

//list base on page
export const perPageProduct = async (req, res) => {
    try {
        const perPage = 6
        const page = req.params.page ? req.params.page : 1
        const perPageProduct = await productModel.find({}).select("-photo").skip((page - 1) * perPage).limit(perPage).sort({
            createdAt: -1
        })
        res.status(200).send({
            success: true,
            perPageProduct
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while fething list of product per page"
        })
    }
}

//search product

export const searchProduct = async (req, res) => {
    try {
        const { keywords } = req.params;
        const result = await productModel.find({
            $or: [
                { name: { $regex: keywords, $options: "i" } },
                { description: { $regex: keywords, $options: "i" } }
            ]
        }).select("-photo")
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while fething behalf of search"
        })
    }
}

//realted product
export const realtedProduct = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const similarProduct = await productModel.find({
            category: cid,
            _id: { $ne: pid }
        }).select("-photo").limit(3).populate("category")
        res.status(200).send({
            success: true,
            similarProduct
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while fething related product"
        })
    }
}
//category vise products
export const categoryProduct = async (req, res) => {
    try {
        const category = await catModel.findOne({ slug: req.params.slug })
        const catProducts = await productModel.find({ category }).populate("category")
        res.status(200).send({
            success: true,
            category,
            catProducts
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while fething category wise product"
        })
    }
}

//braintree token gateway

export const braintreeToken = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err)
            } else {
                res.send(response)
            }
        })
    } catch (error) {
        console.log(error)
    }
}

//braintree payment gateway
export const braintreePayment = async (req, res) => {
    try {
        const { nonce, cart } = req.body;
        let total = 0
        cart.map((i) => {
            total += i.price
        })
        let newTransaction = gateway.transaction.sale(
            {
                amount: total,
                paymentMethodNonce: nonce,
                options: {
                    submitForSettlement: true
                }
            },
            function (err, result) {
                if (result) {
                    const order = new orderModel({
                        product: cart,
                        payment: result,
                        buyer: req.user._id
                    }).save()
                    res.json({ ok: true })
                } else {
                    res.status(500).send(err)
                }
            }
        )
    } catch (error) {
        console.log(error)
    }
}

