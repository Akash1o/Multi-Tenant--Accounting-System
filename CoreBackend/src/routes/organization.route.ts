import { Router } from "express";
import { authenticateMiddleware } from "../middlewares/authMiddleware";
import validateRequest from "../middlewares/validateRequestMiddleware";
import { createOrganizationSchema } from "../schemas/organization.schema";
import { OrganizationController } from "../controllers/organization.controller";


const router =Router();


router.post(
        "/",
        authenticateMiddleware,
        validateRequest(createOrganizationSchema),
        OrganizationController.createOrganization

    )

    export default router;