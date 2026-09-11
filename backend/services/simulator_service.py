import math
from typing import Dict, List, Any, Optional

class SimulatorService:
    def __init__(self):
        self.baseline_months = 24.5
        self.base_project_cost_cr = 500.0
        self.total_project_land_ha = 1800.0

        # Scenario Presets
        self.preset_scenarios = {
            "dilrmp_100": {
                "id": "dilrmp_100",
                "title": "🟢 Full DILRMP Digital Saturation",
                "description": "100% ULPIN Bhu-Aadhaar seeding and 100% Cadastral Vectorization saturation across all tehsils.",
                "ulpin_pct": 100.0,
                "vector_pct": 100.0,
                "dbt_days": 45,
                "sia_days": 30,
                "adr_rate": 50.0,
                "govt_swap_pct": 40.0
            },
            "dbt_express": {
                "id": "dbt_express",
                "title": "⚡ 14-Day DBT Express Compensation",
                "description": "Single-window clearance accelerating Direct Benefit Transfer payouts to landholders in 14 days.",
                "ulpin_pct": 88.0,
                "vector_pct": 85.0,
                "dbt_days": 14,
                "sia_days": 15,
                "adr_rate": 60.0,
                "govt_swap_pct": 30.0
            },
            "adr_fasttrack": {
                "id": "adr_fasttrack",
                "title": "⚖️ Revenue Court Fast-Track ADR",
                "description": "Special Lok Adalat fast-track resolution resolving 85% of co-sharer partition disputes out of court.",
                "ulpin_pct": 82.0,
                "vector_pct": 80.0,
                "dbt_days": 30,
                "sia_days": 25,
                "adr_rate": 85.0,
                "govt_swap_pct": 25.0
            },
            "govt_swap": {
                "id": "govt_swap",
                "title": "🏛️ Govt Land Bank Priority Swap",
                "description": "Maximizes public revenue wasteland swap (65%) to bypass private encumbered parcels.",
                "ulpin_pct": 90.0,
                "vector_pct": 92.0,
                "dbt_days": 21,
                "sia_days": 20,
                "adr_rate": 70.0,
                "govt_swap_pct": 65.0
            }
        }

    def predict(
        self,
        ulpin_pct: float = 68.2,
        vector_pct: float = 76.5,
        dbt_days: float = 90.0,
        sia_days: float = 60.0,
        adr_rate: float = 20.0,
        govt_swap_pct: float = 10.0
    ) -> Dict[str, Any]:
        """
        Calculates both Administrative Land Governance Metrics AND Citizen Socio-Economic USP Metrics.
        """
        # Clamp inputs
        ulpin_pct = max(0.0, min(100.0, float(ulpin_pct)))
        vector_pct = max(0.0, min(100.0, float(vector_pct)))
        dbt_days = max(1.0, min(180.0, float(dbt_days)))
        sia_days = max(1.0, min(120.0, float(sia_days)))
        adr_rate = max(0.0, min(100.0, float(adr_rate)))
        govt_swap_pct = max(0.0, min(100.0, float(govt_swap_pct)))

        # ---------------------------------------------------------
        # 1. ADMINISTRATIVE GOVERNANCE CALCULATIONS
        # ---------------------------------------------------------
        ulpin_gain = (ulpin_pct - 68.2) * 0.055
        vector_gain = (vector_pct - 76.5) * 0.045
        dbt_gain = (90.0 - dbt_days) * 0.042
        sia_gain = (60.0 - sia_days) * 0.048
        adr_gain = (adr_rate - 20.0) * 0.035
        swap_gain = (govt_swap_pct - 10.0) * 0.038

        total_reduction = ulpin_gain + vector_gain + dbt_gain + sia_gain + adr_gain + swap_gain
        simulated_months = max(6.0, round(self.baseline_months - total_reduction, 1))
        months_saved = round(self.baseline_months - simulated_months, 1)

        # Financial Cost Overruns Saved (Interest & Price Escalation)
        savings_cr = round(months_saved * 6.33, 1)
        simulated_project_cost_cr = round(self.base_project_cost_cr - savings_cr, 1)

        # Litigation & Injunction Risk Index
        raw_risk = 34.2 - (ulpin_pct * 0.11 + adr_rate * 0.14 + vector_pct * 0.07 + swap_gain * 0.5)
        simulated_risk_pct = max(4.5, round(raw_risk, 1))
        
        if simulated_risk_pct < 12.0:
            risk_level = "LOW"
            risk_color = "#34d399"
        elif simulated_risk_pct < 24.0:
            risk_level = "MEDIUM"
            risk_color = "#f59e0b"
        else:
            risk_level = "HIGH"
            risk_color = "#f87171"

        # Govt Land Swap Area
        govt_land_ha_used = round(self.total_project_land_ha * (govt_swap_pct / 100.0), 1)

        # Rehabilitation & Resettlement (R&R) Satisfaction Score
        r_and_r_satisfaction_pct = round(min(98.5, 62.0 + (90.0 - dbt_days) * 0.28 + adr_rate * 0.15), 1)

        # Acquisition Timeline S-Curve Data Points (0 to 30 months)
        s_curve_data = []
        months_axis = [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30]
        for m in months_axis:
            # Baseline sigmoidal progress curve
            base_pct = round(100.0 / (1.0 + math.exp(-0.3 * (m - 14))), 1)
            # Simulated accelerated sigmoidal progress curve
            sim_midpoint = max(4, simulated_months / 1.8)
            sim_pct = round(100.0 / (1.0 + math.exp(-0.45 * (m - sim_midpoint))), 1)
            s_curve_data.append({
                "month": f"M{m}",
                "baseline_pct": base_pct,
                "simulated_pct": min(100.0, sim_pct)
            })

        # ---------------------------------------------------------
        # 2. CITIZEN & SOCIO-ECONOMIC USP CALCULATIONS
        # ---------------------------------------------------------
        # Daily Fuel Saved (Liters) via decongestion and shorter detours
        daily_fuel_saved_liters = int(months_saved * 10500 + (govt_swap_pct * 320))
        # Annual transport expense savings per average local household (₹)
        annual_household_savings_rs = int(round((daily_fuel_saved_liters * 96.5 * 365) / 12500, -2))

        # Peak Hour Traffic Decongestion
        traffic_decongestion_pct = round(min(68.0, 16.0 + months_saved * 3.4), 1)
        baseline_travel_time_mins = 110
        simulated_travel_time_mins = int(round(baseline_travel_time_mins * (1.0 - traffic_decongestion_pct / 100.0)))

        # Employment Creation Breakdown
        direct_construction_jobs = int(11500 + (months_saved * 380))
        indirect_logistics_jobs = int(3200 + (govt_swap_pct * 65))
        total_jobs_created = direct_construction_jobs + indirect_logistics_jobs

        # Agricultural Market Access & Land Appreciation
        perishable_crop_loss_reduction_pct = round(min(38.0, 7.5 + months_saved * 2.1), 1)
        farm_income_boost_pct = round(min(28.0, 4.5 + months_saved * 1.3), 1)
        surrounding_land_appreciation_mult = round(1.0 + (months_saved * 0.11) + (ulpin_pct * 0.005), 2)

        # ---------------------------------------------------------
        # 3. GROUNDED AI EXECUTIVE NARRATIVE SYNTHESIS
        # ---------------------------------------------------------
        executive_summary = (
            f"By elevating ULPIN seeding to {ulpin_pct:.1f}% and expediting compensation DBT to {dbt_days:.0f} days, "
            f"the acquisition timeline is compressed from 24.5 months to {simulated_months:.1f} months (saving {months_saved:.1f} months). "
            f"This avoids ₹ {savings_cr:.1f} Crores in holding costs and reduces litigation risk to {risk_level} ({simulated_risk_pct:.1f}%). "
            f"For local citizens, it conserves {daily_fuel_saved_liters:,} Liters of fuel daily (saving ₹ {annual_household_savings_rs:,}/year per family), "
            f"cuts commute times from 110 mins to {simulated_travel_time_mins} mins, and creates {total_jobs_created:,} new jobs."
        )

        return {
            "inputs": {
                "ulpin_pct": ulpin_pct,
                "vector_pct": vector_pct,
                "dbt_days": dbt_days,
                "sia_days": sia_days,
                "adr_rate": adr_rate,
                "govt_swap_pct": govt_swap_pct
            },
            "administrative_metrics": {
                "baseline_months": self.baseline_months,
                "simulated_months": simulated_months,
                "months_saved": months_saved,
                "base_project_cost_cr": self.base_project_cost_cr,
                "simulated_project_cost_cr": simulated_project_cost_cr,
                "savings_cr": savings_cr,
                "baseline_risk_pct": 34.2,
                "simulated_risk_pct": simulated_risk_pct,
                "risk_level": risk_level,
                "risk_color": risk_color,
                "govt_land_ha_used": govt_land_ha_used,
                "total_project_land_ha": self.total_project_land_ha,
                "r_and_r_satisfaction_pct": r_and_r_satisfaction_pct,
                "s_curve_timeline": s_curve_data
            },
            "socio_economic_usp_metrics": {
                "daily_fuel_saved_liters": daily_fuel_saved_liters,
                "annual_household_savings_rs": annual_household_savings_rs,
                "traffic_decongestion_pct": traffic_decongestion_pct,
                "baseline_travel_time_mins": baseline_travel_time_mins,
                "simulated_travel_time_mins": simulated_travel_time_mins,
                "direct_construction_jobs": direct_construction_jobs,
                "indirect_logistics_jobs": indirect_logistics_jobs,
                "total_jobs_created": total_jobs_created,
                "perishable_crop_loss_reduction_pct": perishable_crop_loss_reduction_pct,
                "farm_income_boost_pct": farm_income_boost_pct,
                "surrounding_land_appreciation_mult": surrounding_land_appreciation_mult
            },
            "executive_summary": executive_summary
        }

    def get_scenarios(self) -> List[Dict[str, Any]]:
        return list(self.preset_scenarios.values())

simulator_service = SimulatorService()
