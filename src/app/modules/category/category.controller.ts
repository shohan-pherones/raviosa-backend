import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CategoryServices } from "./category.service";

const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const categoryData = req.body;
    const category = await CategoryServices.createCategory(categoryData);

    res
      .status(StatusCodes.CREATED)
      .json({ message: "Category created successfully", category });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

const getSingleCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { categoryId } = req.params;
    const category = await CategoryServices.getSingleCategory(categoryId);

    res
      .status(StatusCodes.OK)
      .json({ message: "Category retrieved successfully", category });
  } catch (error: any) {
    res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
  }
};

const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await CategoryServices.getAllCategories();

    res
      .status(StatusCodes.OK)
      .json({ message: "Categories retrieved successfully", categories });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoryId } = req.params;
    const updateData = req.body;

    const category = await CategoryServices.updateCategory(
      categoryId,
      updateData
    );

    res
      .status(StatusCodes.OK)
      .json({ message: "Category updated successfully", category });
  } catch (error: any) {
    res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
  }
};

const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoryId } = req.params;
    await CategoryServices.deleteCategory(categoryId);

    res
      .status(StatusCodes.OK)
      .json({ message: "Category deleted successfully" });
  } catch (error: any) {
    res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
  }
};

export const CategoryControllers = {
  createCategory,
  getSingleCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
