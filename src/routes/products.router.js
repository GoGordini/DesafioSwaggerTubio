import { Router } from 'express';
import validator from '../middlewares/validator.js';
import { getProduct, getProductById, deleteProduct, createProduct, updateProduct,mockingProducts } from '../controllers/products.controller.js';
import {getProductByIdSchema,productSchema} from "../schemas/products.schema.js";
import {authorization} from '../utils.js';
import {accessRolesEnum} from "../config/enums.js";

const router = Router();

router.get('/', getProduct);

router.get('/mockingproducts', mockingProducts);

router.get("/:pid", validator.params(getProductByIdSchema),getProductById);

router.delete("/:pid", authorization([accessRolesEnum.ADMIN,accessRolesEnum.PREMIUM]),validator.params(getProductByIdSchema),deleteProduct);

//router.post("/", authorization(accessRolesEnum.ADMIN),validator.body(productSchema),createProduct);
router.post("/", authorization([accessRolesEnum.ADMIN,accessRolesEnum.PREMIUM]),createProduct);

router.put("/:pid", authorization(accessRolesEnum.ADMIN),validator.params(getProductByIdSchema),validator.body(productSchema),updateProduct);

export default router;