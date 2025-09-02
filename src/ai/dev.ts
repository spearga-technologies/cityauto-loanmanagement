import { config } from 'dotenv';
config();

import '@/ai/flows/categorize-payment-transactions.ts';
import '@/ai/flows/predict-future-payment-defaults.ts';