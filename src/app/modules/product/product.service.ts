import { StatusCodes } from "http-status-codes";
import { startSession } from "mongoose";
import AppError from "../../errors/app.error";
import { IProduct } from "./product.interface";
import ProductModel from "./product.model";

const createProduct = async (productData: IProduct): Promise<IProduct> => {
  const session = await startSession();

  try {
    session.startTransaction();

    const { name, description, price, stock, categories, images } = productData;

    const conflicted = (await getAllProducts()).filter(
      (prod) => prod.name === name
    );

    if (conflicted.length > 0) {
      throw new AppError(StatusCodes.CONFLICT, "Product already exists");
    }

    const product = await ProductModel.create(
      [
        {
          name,
          description,
          price,
          stock,
          categories,
          images,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    return product[0].populate("categories");
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getSingleProduct = async (productId: string): Promise<IProduct> => {
  const product = await ProductModel.findById(productId).populate("categories");

  if (!product) {
    throw new AppError(StatusCodes.NOT_FOUND, "Product not found");
  }

  return product;
};

const getAllProducts = async (): Promise<IProduct[]> => {
  const products = await ProductModel.find().populate("categories");
  return products;
};

const updateProduct = async (
  productId: string,
  updateData: Partial<IProduct>
): Promise<IProduct> => {
  const session = await startSession();

  try {
    session.startTransaction();

    const { name, description, price, stock, categories, images } = updateData;

    const conflicted = (await getAllProducts()).filter(
      (prod) => prod.name === name
    );

    if (conflicted.length > 0) {
      throw new AppError(StatusCodes.CONFLICT, "Product already exists");
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      {
        $set: { name, description, price, stock, categories, images },
      },
      { new: true, session }
    ).populate("categories");

    if (!updatedProduct) {
      throw new AppError(StatusCodes.NOT_FOUND, "Product not found");
    }

    await session.commitTransaction();
    return updatedProduct;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const deleteProduct = async (productId: string): Promise<void> => {
  const product = await ProductModel.findByIdAndDelete(productId);

  if (!product) {
    throw new AppError(StatusCodes.NOT_FOUND, "Product not found");
  }
};

export const ProductServices = {
  createProduct,
  getSingleProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
