import { Router } from "express";
import {
  getPortfolio,
  getReturns
} from "../controllers/PortfolioController";
const router = Router();

//Getting portfolio
router.get("/portfolio", getPortfolio);

//Getting returns
router.get("/returns", getReturns);
