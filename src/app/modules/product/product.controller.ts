import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ProductServices } from "./product.service";
import AppError from "../../errors/app.error";

const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const image = req.file?.path;

    if (!image) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Image is required");
    }

    const body = req.body;
    const product = await ProductServices.createProduct({ ...body, image });

    res.status(StatusCodes.CREATED).json({
      message: "Product created successfully",
      product,
    });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

const getSingleProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const product = await ProductServices.getSingleProduct(productId);

    res.status(StatusCodes.OK).json({
      message: "Product retrieved successfully",
      product,
    });
  } catch (error: any) {
    res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
  }
};

const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await ProductServices.getAllProducts();

    res.status(StatusCodes.OK).json({
      message: "Products retrieved successfully",
      products,
    });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const updateData = req.body;

    const product = await ProductServices.updateProduct(productId, updateData);

    res.status(StatusCodes.OK).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error: any) {
    res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
  }
};

const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    await ProductServices.deleteProduct(productId);

    res.status(StatusCodes.OK).json({
      message: "Product deleted successfully",
    });
  } catch (error: any) {
    res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
  }
};

export const ProductControllers = {
  createProduct,
  getSingleProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
