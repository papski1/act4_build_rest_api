import express, {Request, Response} from "express"
import { Product, UnitProduct} from "./product.interface"
import * as database from "./product.database"
import {StatusCodes} from "http-status-codes"

export const productRouter = express.Router()

productRouter.get("/products", async (req: Request, res: Response) => {
    try{
        const allProducts = await database.findAll()

        if (!allProducts){
            return res.status(StatusCodes.NOT_FOUND).json({error:`No products found!`})
        }

        return res.status(StatusCodes.OK).json({total: allProducts.length, allProducts: allProducts})
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err})
    }
})

productRouter.get("/product/:id", async (req: Request, res:Response) => {
    try {
        const product = await database.findOne(req.params.id)
    
        if (!product){
            return res.status(StatusCodes.NOT_FOUND).json({error: `Product does not exist!`})
        }

        return res.status(StatusCodes.OK).json(product)
    } catch(err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err})
    }
})

productRouter.post("/product", async (req: Request, res: Response) => {
    try {
        const {name, price, quantity, image} = req.body
        
        if(!name || !price || !quantity || !image) {
            return res.status(StatusCodes.BAD_REQUEST).json({error: "Please provide all the required parameters..."})
        }
        const newProduct = await database.create({...req.body})
        return res.status(StatusCodes.CREATED).json({newProduct})
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err})
    }
})

productRouter.put("/product/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const newProduct = req.body
        const findProduct = await database.findOne(id)

        if (!findProduct){
            return res.status(StatusCodes.NOT_FOUND).json({error: `Product does not exist...`})
        }
        
        const updateProduct = await database.update(id, newProduct)
        return res.status(StatusCodes.OK).json({updateProduct})
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err})
    }
})

productRouter.delete("/product/:id", async (req: Request, res: Response) => {
    try {
        const getProduct = await database.findOne(req.params.id)

        if(!getProduct){
            return res.status(StatusCodes.NOT_FOUND).json({error: `Product does not exist...`})
        }
        
        await database.remove(req.params.id)
        return res.status(StatusCodes.OK).json({msg: "Product deleted successfully!"})
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err})
    }
})