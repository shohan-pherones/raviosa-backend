import { StatusCodes } from "http-status-codes";
import { startSession } from "mongoose";
import AppError from "../../errors/app.error";
import { ICategory } from "./category.interface";
import CategoryModel from "./category.model";

const createCategory = async (categoryData: ICategory): Promise<ICategory> => {
  const session = await startSession();

  try {
    session.startTransaction();

    const { name } = categoryData;

    const conflicted = (await getAllCategories()).filter(
      (cat) => cat.name === name
    );

    if (conflicted.length > 0) {
      throw new AppError(StatusCodes.CONFLICT, "Category already exists");
    }

    const category = await CategoryModel.create([categoryData], { session });

    await session.commitTransaction();
    return category[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getSingleCategory = async (categoryId: string): Promise<ICategory> => {
  const category = await CategoryModel.findById(categoryId);

  if (!category) {
    throw new AppError(StatusCodes.NOT_FOUND, "Category not found");
  }

  return category;
};

const getAllCategories = async (): Promise<ICategory[]> => {
  const categories = await CategoryModel.find();
  return categories;
};

const updateCategory = async (
  categoryId: string,
  updateData: Partial<ICategory>
): Promise<ICategory> => {
  const session = await startSession();

  try {
    session.startTransaction();

    const { name } = updateData;

    const conflicted = (await getAllCategories()).filter(
      (cat) => cat.name === name
    );

    if (conflicted.length > 0) {
      throw new AppError(StatusCodes.CONFLICT, "Category already exists");
    }

    const category = await CategoryModel.findByIdAndUpdate(
      categoryId,
      { $set: updateData },
      { new: true, session }
    );

    if (!category) {
      throw new AppError(StatusCodes.NOT_FOUND, "Category not found");
    }

    await session.commitTransaction();
    return category;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const deleteCategory = async (categoryId: string): Promise<void> => {
  const category = await CategoryModel.findByIdAndDelete(categoryId);

  if (!category) {
    throw new AppError(StatusCodes.NOT_FOUND, "Category not found");
  }
};

export const CategoryServices = {
  createCategory,
  getSingleCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
