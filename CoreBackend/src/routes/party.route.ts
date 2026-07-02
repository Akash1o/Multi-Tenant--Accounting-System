import { Router } from "express";
import validateRequest from "../middlewares/validateRequestMiddleware";
import { createPartySchema, getPartiesSchema, getPartyByIdSchema, updatePartySchema } from "../schemas/party.schema";
import { PartyController } from "../controllers/party.controller";
import { authenticateMiddleware } from "../middlewares/authMiddleware";

const router =Router();


router.post(
        "/",
        authenticateMiddleware,
        validateRequest(createPartySchema),
        PartyController.createParty

    )


    router.get(
        "/",
        authenticateMiddleware,
        validateRequest(getPartiesSchema),
        PartyController.getParties

    )


       router.get(
        "/:id",
        authenticateMiddleware,
        validateRequest(getPartyByIdSchema),
        PartyController.getPartyById

    )


     router.put(
        "/:id",
        authenticateMiddleware,
        validateRequest(updatePartySchema),
        PartyController.updateParty

    )


    router.delete(
  "/:id",
  authenticateMiddleware,
  PartyController.deleteParty
);
export default router;