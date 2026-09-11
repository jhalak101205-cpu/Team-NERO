import math
from typing import Dict, List, Any, Optional

class SimulatorService:
    def __init__(self):
        # 5 Diverse Infrastructure & Policy Domains
        self.domains = {
            "highway": {
                "id": "highway",
                "name": "🛣️ National Highway & Expressway Corridor",
                "category": "Transport Infrastructure",
                "baseline_months": 24.5,
                "base_project_cost_cr": 500.0,
                "total_project_land_ha": 1800.0,
                "primary_metric_label": "Daily Fuel Saved",
                "primary_metric_unit": "Liters/Day",
                "secondary_metric_label": "Traffic Decongestion",
                "description": "Linear corridor acquisition under LARR 2013 with high focus on commuter fuel savings and right-of-way."
            },
            "solar_park": {
                "id": "solar_park",
                "name": "☀️ Mega Solar & Renewable Energy Park",
                "category": "Renewable Energy",
                "baseline_months": 18.0,
                "base_project_cost_cr": 750.0,
                "total_project_land_ha": 3500.0,
                "primary_metric_label": "Clean Power Capacity",
                "primary_metric_unit": "MW",
                "secondary_metric_label": "CO2 Abatement",
                "description": "Large contiguous public wasteland acquisition for utility-scale solar generation and green jobs."
            },
            "industrial_corridor": {
                "id": "industrial_corridor",
                "name": "🏭 Industrial Manufacturing & Defense Corridor",
                "category": "Industrial Investment",
                "baseline_months": 30.0,
                "base_project_cost_cr": 1200.0,
                "total_project_land_ha": 2500.0,
                "primary_metric_label": "Industrial Investment Boost",
                "primary_metric_unit": "₹ Cr Attracted",
                "secondary_metric_label": "Factory Jobs Created",
                "description": "Multi-tier industrial zone land acquisition focusing on manufacturing hubs, exports, and warehousing."
            },
            "agri_canal": {
                "id": "agri_canal",
                "name": "🌾 Irrigation Canal & Watershed Network",
                "category": "Agriculture & Water",
                "baseline_months": 21.0,
                "base_project_cost_cr": 350.0,
                "total_project_land_ha": 1200.0,
                "primary_metric_label": "Newly Irrigated Acreage",
                "primary_metric_unit": "Hectares",
                "secondary_metric_label": "Crop Yield Boost",
                "description": "Canal right-of-way & reservoir catchments under PMKSY targeting farm income and drought resilience."
            },
            "urban_lps": {
                "id": "urban_lps",
                "name": "🏙️ Smart City Land Pooling Scheme (LPS)",
                "category": "Urban Development",
                "baseline_months": 16.0,
                "base_project_cost_cr": 450.0,
                "total_project_land_ha": 800.0,
                "primary_metric_label": "Landowner Pooling Rate",
                "primary_metric_unit": "% Saturation",
                "secondary_metric_label": "Slum Prevention Index",
                "description": "Voluntary urban land reconstitution (Amaravati / Gujarat Model) yielding commercial plot returns to farmers."
            }
        }

        # Comprehensive Database of Indian Cities & Corridor Hubs
        self.city_db = {
            "moradabad": (28.8386, 78.7733),
            "delhi": (28.6139, 77.2090),
            "new delhi": (28.6139, 77.2090),
            "ncr": (28.6139, 77.2090),
            "ludhiana": (30.9010, 75.8573),
            "jalandhar": (31.3260, 75.5762),
            "mumbai": (19.0760, 72.8777),
            "pune": (18.5204, 73.8567),
            "bengaluru": (12.9716, 77.5946),
            "bangalore": (12.9716, 77.5946),
            "chennai": (13.0827, 80.2707),
            "hyderabad": (17.3850, 78.4867),
            "kolkata": (22.5726, 88.3639),
            "jaipur": (26.9124, 75.7873),
            "ahmedabad": (23.0225, 72.5714),
            "lucknow": (26.8467, 80.9462),
            "varanasi": (25.3176, 82.9739),
            "agra": (27.1767, 78.0081),
            "kanpur": (26.4499, 80.3319),
            "chandigarh": (30.7333, 76.7794),
            "amritsar": (31.6340, 74.8723),
            "bhopal": (23.2599, 77.4126),
            "indore": (22.7196, 75.8577),
            "nagpur": (21.1458, 79.0882),
            "patna": (25.5941, 85.1376),
            "ranchi": (23.3441, 85.3096),
            "bhubaneswar": (20.2961, 85.8245),
            "guwahati": (26.1445, 91.7362),
            "dehradun": (30.3165, 78.0322),
            "shimla": (31.1048, 77.1734),
            "surat": (21.1702, 72.8311),
            "vadodara": (22.3072, 73.1812),
            "coimbatore": (11.0168, 76.9558),
            "kochi": (9.9312, 76.2673),
            "thiruvananthapuram": (8.5241, 76.9366),
            "visakhapatnam": (17.6868, 83.2185),
            "vijayawada": (16.5062, 80.6480),
            "madurai": (9.9252, 78.1198),
            "prayagraj": (25.4358, 81.8463),
            "allahabad": (25.4358, 81.8463),
            "gorakhpur": (26.7606, 83.3732),
            "meerut": (28.9845, 77.7064),
            "bareilly": (28.3670, 79.4304),
            "aligarh": (27.8974, 78.0880),
            "mathura": (27.4924, 77.6737),
            "gwalior": (26.2183, 78.1828),
            "jabalpur": (23.1815, 79.9864),
            "udaipur": (24.5854, 73.7125),
            "jodhpur": (26.2389, 73.0243),
            "kota": (25.2138, 75.8648),
            "nashik": (19.9975, 73.7898),
            "aurangabad": (19.8762, 75.3433),
        }

    def _resolve_city_coords(self, city_name: Optional[str], fallback_lat: float, fallback_lng: float) -> tuple[float, float]:
        """Resolves city coordinates from internal database or returns fallback."""
        if city_name:
            clean = city_name.lower().strip()
            for key, coords in self.city_db.items():
                if key == clean or key in clean or clean in key:
                    return coords
        return (fallback_lat, fallback_lng)

    def _haversine_distance(self, lat1: float, lng1: float, lat2: float, lng2: float) -> float:
        """Calculate distance in km between two lat/lng points."""
        dlat = math.radians(lat2 - lat1)
        dlng = math.radians(lng2 - lng1)
        a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng/2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        return round(6371 * c, 1)

    def predict(
        self,
        project_domain: str = "highway",
        ulpin_pct: float = 68.2,
        vector_pct: float = 76.5,
        dbt_days: float = 90.0,
        sia_days: float = 60.0,
        adr_rate: float = 20.0,
        govt_swap_pct: float = 10.0,
        custom_budget_cr: Optional[float] = None,
        custom_land_ha: Optional[float] = None,
        state_id: Optional[str] = "all_india",
        start_city: Optional[str] = "MORADABAD",
        end_city: Optional[str] = "DELHI",
        start_lat: Optional[float] = None,
        start_lng: Optional[float] = None,
        end_lat: Optional[float] = None,
        end_lng: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        Dynamically calculates Predictive Metrics for 5 Diverse Policy Domains + Point A to B Route Feasibility Analysis.
        """
        # Resolve domain configuration
        domain_info = self.domains.get(project_domain, self.domains["highway"])
        
        base_months = domain_info["baseline_months"]
        base_cost = custom_budget_cr if custom_budget_cr and custom_budget_cr > 0 else domain_info["base_project_cost_cr"]
        base_land = custom_land_ha if custom_land_ha and custom_land_ha > 0 else domain_info["total_project_land_ha"]

        # Clamp slider inputs
        ulpin_pct = max(0.0, min(100.0, float(ulpin_pct)))
        vector_pct = max(0.0, min(100.0, float(vector_pct)))
        dbt_days = max(1.0, min(180.0, float(dbt_days)))
        sia_days = max(1.0, min(120.0, float(sia_days)))
        adr_rate = max(0.0, min(100.0, float(adr_rate)))
        govt_swap_pct = max(0.0, min(100.0, float(govt_swap_pct)))

        # ---------------------------------------------------------
        # 1. POINT A TO B ROUTE & LOCATION SUITABILITY ANALYSIS
        # ---------------------------------------------------------
        # Resolve actual coordinates from city name if not explicitly passed
        s_lat, s_lng = self._resolve_city_coords(start_city, start_lat or 28.8386, start_lng or 78.7733)
        e_lat, e_lng = self._resolve_city_coords(end_city, end_lat or 28.6139, end_lng or 77.2090)

        # If user passed custom explicit lat/lng that differ from defaults, prioritize them
        if start_lat is not None and start_lng is not None and (start_lat != 30.9010 or start_lng != 75.8573):
            s_lat, s_lng = start_lat, start_lng
        if end_lat is not None and end_lng is not None and (end_lat != 31.3260 or end_lng != 75.5762):
            e_lat, e_lng = end_lat, end_lng

        route_distance_km = self._haversine_distance(s_lat, s_lng, e_lat, e_lng)
        if route_distance_km == 0.0:
            route_distance_km = 160.2

        # Location Suitability Score (0 - 100%)
        suitability_score = round(min(98.0, 52.0 + (ulpin_pct * 0.22) + (govt_swap_pct * 0.18) + (vector_pct * 0.10)), 1)
        
        if suitability_score >= 85.0:
            suitability_rating = "OPTIMAL SITE & ROUTE ALIGNMENT"
            suitability_color = "#34d399"
        elif suitability_score >= 70.0:
            suitability_rating = "HIGH FEASIBILITY LOCATION"
            suitability_color = "#60a5fa"
        else:
            suitability_rating = "MODERATE RISK ALIGNMENT"
            suitability_color = "#f59e0b"

        s_city = start_city if start_city and start_city.strip() else "Point A"
        e_city = end_city if end_city and end_city.strip() else "Point B"

        optimal_recommendation = (
            f"Location Suitability Analysis ({suitability_rating} - {suitability_score}%): "
            f"The proposed route from {s_city} to {e_city} ({route_distance_km} km corridor) "
            f"leverages {round(base_land * (govt_swap_pct / 100.0), 1)} ha of unencumbered Government Land Bank. "
            f"Diverting alignment by 1.2 km near the midpoint bypasses pending co-sharer partition disputes, saving ₹ {round((base_cost * 0.08), 1)} Cr in court stay delays."
        )

        # ---------------------------------------------------------
        # 2. ADMINISTRATIVE GOVERNANCE CALCULATIONS
        # ---------------------------------------------------------
        ulpin_gain = (ulpin_pct - 68.2) * 0.055
        vector_gain = (vector_pct - 76.5) * 0.045
        dbt_gain = (90.0 - dbt_days) * 0.042
        sia_gain = (60.0 - sia_days) * 0.048
        adr_gain = (adr_rate - 20.0) * 0.035
        swap_gain = (govt_swap_pct - 10.0) * 0.038

        total_reduction = ulpin_gain + vector_gain + dbt_gain + sia_gain + adr_gain + swap_gain
        simulated_months = max(4.5, round(base_months - total_reduction, 1))
        months_saved = round(base_months - simulated_months, 1)

        # Financial Cost Overruns Saved
        monthly_holding_rate = round(base_cost * 0.0125, 2)
        savings_cr = round(months_saved * monthly_holding_rate, 1)
        simulated_project_cost_cr = max(round(base_cost * 0.5, 1), round(base_cost - savings_cr, 1))

        # Litigation & Injunction Risk Index
        raw_risk = 34.2 - (ulpin_pct * 0.11 + adr_rate * 0.14 + vector_pct * 0.07 + swap_gain * 0.5)
        simulated_risk_pct = max(3.5, round(raw_risk, 1))
        
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
        govt_land_ha_used = round(base_land * (govt_swap_pct / 100.0), 1)

        # R&R Satisfaction Score
        r_and_r_satisfaction_pct = round(min(98.5, 62.0 + (90.0 - dbt_days) * 0.28 + adr_rate * 0.15), 1)

        # Acquisition Timeline S-Curve Data Points
        s_curve_data = []
        months_axis = [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30]
        for m in months_axis:
            base_midpoint = base_months * 0.55
            base_pct = round(100.0 / (1.0 + math.exp(-0.3 * (m - base_midpoint))), 1)
            sim_midpoint = max(3, simulated_months * 0.45)
            sim_pct = round(100.0 / (1.0 + math.exp(-0.45 * (m - sim_midpoint))), 1)
            s_curve_data.append({
                "month": f"M{m}",
                "baseline_pct": min(100.0, base_pct),
                "simulated_pct": min(100.0, sim_pct)
            })

        # ---------------------------------------------------------
        # 3. DYNAMIC SOCIO-ECONOMIC USP METRICS PER DOMAIN
        # ---------------------------------------------------------
        if project_domain == "solar_park":
            clean_power_mw = int((base_land * 0.4) + (months_saved * 25))
            co2_abatement_tons_yr = int(clean_power_mw * 1450)
            daily_fuel_saved_liters = int(co2_abatement_tons_yr / 365 * 380)
            annual_household_savings_rs = int(round(clean_power_mw * 420, -2))
            traffic_decongestion_pct = round(min(45.0, 10.0 + months_saved * 2.0), 1)
            baseline_travel_time_mins = 60
            simulated_travel_time_mins = int(round(baseline_travel_time_mins * (1.0 - traffic_decongestion_pct / 100.0)))
            direct_construction_jobs = int(clean_power_mw * 8.5)
            indirect_logistics_jobs = int(clean_power_mw * 4.2)
            total_jobs_created = direct_construction_jobs + indirect_logistics_jobs
            perishable_crop_loss_reduction_pct = 15.0
            farm_income_boost_pct = round(min(32.0, 8.0 + months_saved * 1.5), 1)
            surrounding_land_appreciation_mult = round(1.0 + (months_saved * 0.08) + (ulpin_pct * 0.004), 2)
            domain_primary_str = f"{clean_power_mw:,} MW Capacity"
            domain_secondary_str = f"{co2_abatement_tons_yr:,} Tons CO2 / Yr"

        elif project_domain == "industrial_corridor":
            investment_attracted_cr = round(base_cost * 2.8 + (months_saved * 45), 1)
            factory_units_created = int((base_land / 15.0) + (months_saved * 12))
            daily_fuel_saved_liters = int(months_saved * 18500 + (govt_swap_pct * 450))
            annual_household_savings_rs = int(round((daily_fuel_saved_liters * 96.5 * 365) / 10000, -2))
            traffic_decongestion_pct = round(min(72.0, 22.0 + months_saved * 3.8), 1)
            baseline_travel_time_mins = 130
            simulated_travel_time_mins = int(round(baseline_travel_time_mins * (1.0 - traffic_decongestion_pct / 100.0)))
            direct_construction_jobs = int(base_cost * 18.5)
            indirect_logistics_jobs = int(base_cost * 14.2)
            total_jobs_created = direct_construction_jobs + indirect_logistics_jobs
            perishable_crop_loss_reduction_pct = round(min(42.0, 12.0 + months_saved * 2.2), 1)
            farm_income_boost_pct = round(min(35.0, 10.0 + months_saved * 1.6), 1)
            surrounding_land_appreciation_mult = round(1.0 + (months_saved * 0.14) + (ulpin_pct * 0.006), 2)
            domain_primary_str = f"₹ {investment_attracted_cr:,.1f} Cr Invested"
            domain_secondary_str = f"{factory_units_created:,} Factory Units"

        elif project_domain == "agri_canal":
            irrigated_acreage_ha = int(base_land * 8.5 + (months_saved * 420))
            crop_yield_boost_pct = round(min(45.0, 14.0 + months_saved * 2.5), 1)
            daily_fuel_saved_liters = int(months_saved * 8200 + (govt_swap_pct * 210))
            annual_household_savings_rs = int(round(irrigated_acreage_ha * 4.5, -2))
            traffic_decongestion_pct = round(min(40.0, 8.0 + months_saved * 1.8), 1)
            baseline_travel_time_mins = 85
            simulated_travel_time_mins = int(round(baseline_travel_time_mins * (1.0 - traffic_decongestion_pct / 100.0)))
            direct_construction_jobs = int(base_land * 6.2)
            indirect_logistics_jobs = int(base_land * 4.8)
            total_jobs_created = direct_construction_jobs + indirect_logistics_jobs
            perishable_crop_loss_reduction_pct = round(min(55.0, 20.0 + months_saved * 3.1), 1)
            farm_income_boost_pct = crop_yield_boost_pct
            surrounding_land_appreciation_mult = round(1.0 + (months_saved * 0.09) + (ulpin_pct * 0.004), 2)
            domain_primary_str = f"{irrigated_acreage_ha:,} ha Irrigated"
            domain_secondary_str = f"+{crop_yield_boost_pct}% Crop Yield"

        elif project_domain == "urban_lps":
            pooling_participation_pct = round(min(96.0, 58.0 + (ulpin_pct - 68.2) * 0.4 + (adr_rate * 0.2)), 1)
            housing_units_created = int((base_land * 12.0) + (months_saved * 180))
            daily_fuel_saved_liters = int(months_saved * 14200 + (govt_swap_pct * 390))
            annual_household_savings_rs = int(round((daily_fuel_saved_liters * 96.5 * 365) / 11000, -2))
            traffic_decongestion_pct = round(min(65.0, 18.0 + months_saved * 3.2), 1)
            baseline_travel_time_mins = 95
            simulated_travel_time_mins = int(round(baseline_travel_time_mins * (1.0 - traffic_decongestion_pct / 100.0)))
            direct_construction_jobs = int(base_cost * 14.5)
            indirect_logistics_jobs = int(base_cost * 8.2)
            total_jobs_created = direct_construction_jobs + indirect_logistics_jobs
            perishable_crop_loss_reduction_pct = 22.0
            farm_income_boost_pct = round(min(26.0, 6.0 + months_saved * 1.2), 1)
            surrounding_land_appreciation_mult = round(1.0 + (months_saved * 0.16) + (ulpin_pct * 0.007), 2)
            domain_primary_str = f"{pooling_participation_pct}% Farmers Pooled"
            domain_secondary_str = f"{housing_units_created:,} Housing Units"

        else:
            daily_fuel_saved_liters = int(months_saved * 10500 + (govt_swap_pct * 320))
            annual_household_savings_rs = int(round((daily_fuel_saved_liters * 96.5 * 365) / 12500, -2))
            traffic_decongestion_pct = round(min(68.0, 16.0 + months_saved * 3.4), 1)
            baseline_travel_time_mins = 110
            simulated_travel_time_mins = int(round(baseline_travel_time_mins * (1.0 - traffic_decongestion_pct / 100.0)))
            direct_construction_jobs = int(11500 + (months_saved * 380))
            indirect_logistics_jobs = int(3200 + (govt_swap_pct * 65))
            total_jobs_created = direct_construction_jobs + indirect_logistics_jobs
            perishable_crop_loss_reduction_pct = round(min(38.0, 7.5 + months_saved * 2.1), 1)
            farm_income_boost_pct = round(min(28.0, 4.5 + months_saved * 1.3), 1)
            surrounding_land_appreciation_mult = round(1.0 + (months_saved * 0.11) + (ulpin_pct * 0.005), 2)
            domain_primary_str = f"{daily_fuel_saved_liters:,} Liters/Day"
            domain_secondary_str = f"{traffic_decongestion_pct}% Cut"

        # ---------------------------------------------------------
        # 4. GROUNDED AI EXECUTIVE NARRATIVE SYNTHESIS
        # ---------------------------------------------------------
        executive_summary = (
            f"Under the '{domain_info['name']}' policy framework for the {s_city} to {e_city} corridor ({route_distance_km} km), "
            f"elevating ULPIN seeding to {ulpin_pct:.1f}% and accelerating compensation DBT to {dbt_days:.0f} days compresses completion from {base_months:.1f} to {simulated_months:.1f} months "
            f"(saving {months_saved:.1f} months). Location suitability rating is {suitability_rating} ({suitability_score}%). "
            f"This avoids ₹ {savings_cr:.1f} Crores in holding overruns and drops litigation risk to {risk_level} ({simulated_risk_pct:.1f}%). "
            f"For local citizens, it achieves {domain_primary_str}, saves ₹ {annual_household_savings_rs:,}/year per family, and creates {total_jobs_created:,} total jobs."
        )

        return {
            "domain": domain_info,
            "route_location": {
                "start_city": s_city,
                "end_city": e_city,
                "start_coords": [s_lat, s_lng],
                "end_coords": [e_lat, e_lng],
                "route_distance_km": route_distance_km,
                "suitability_score": suitability_score,
                "suitability_rating": suitability_rating,
                "suitability_color": suitability_color,
                "optimal_recommendation": optimal_recommendation
            },
            "inputs": {
                "project_domain": project_domain,
                "ulpin_pct": ulpin_pct,
                "vector_pct": vector_pct,
                "dbt_days": dbt_days,
                "sia_days": sia_days,
                "adr_rate": adr_rate,
                "govt_swap_pct": govt_swap_pct,
                "custom_budget_cr": base_cost,
                "custom_land_ha": base_land
            },
            "administrative_metrics": {
                "baseline_months": base_months,
                "simulated_months": simulated_months,
                "months_saved": months_saved,
                "base_project_cost_cr": base_cost,
                "simulated_project_cost_cr": simulated_project_cost_cr,
                "savings_cr": savings_cr,
                "baseline_risk_pct": 34.2,
                "simulated_risk_pct": simulated_risk_pct,
                "risk_level": risk_level,
                "risk_color": risk_color,
                "govt_land_ha_used": govt_land_ha_used,
                "total_project_land_ha": base_land,
                "r_and_r_satisfaction_pct": r_and_r_satisfaction_pct,
                "s_curve_timeline": s_curve_data
            },
            "socio_economic_usp_metrics": {
                "domain_primary_str": domain_primary_str,
                "domain_secondary_str": domain_secondary_str,
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

    def get_domains(self) -> List[Dict[str, Any]]:
        return list(self.domains.values())

    def get_scenarios(self) -> List[Dict[str, Any]]:
        return list(self.preset_scenarios.values())

simulator_service = SimulatorService()
