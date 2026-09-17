import React, { useState, useMemo, useEffect } from 'react';
import { Meal, UserProfile, FilterOptions } from './types';
import { MEALS_DATABASE, checkMealAllergyConflict, getMealFoodTypes } from './data/meals';
import { TURKEY_MARKETS, ALLERGY_OPTIONS } from './data/citiesAndMarkets';
import { Header } from './components/Header';
import { FoodDiscoveryHub } from './components/FoodDiscoveryHub';
import { FilterBar } from './components/FilterBar';
import { MealCard } from './components/MealCard';
import { MealDetailModal } from './components/MealDetailModal';
import { OnboardingFlow } from './components/OnboardingFlow';
import { AiRecipeModal } from './components/AiRecipeModal';
import { SheetsExportModal } from './components/SheetsExportModal';
import { SponsoredAdBanner } from './components/SponsoredAdBanner';
import { ProMembershipModal } from './components/ProMembershipModal';
import { RewardedVideoAdModal } from './components/RewardedVideoAdModal';
import { Sparkles, Store, MapPin, Wallet, ShieldCheck, Crown } from 'lucide-react';

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  age: 25,
  gender: 'male',
  weightKg: 74,
  heightCm: 178,
  city: 'Adana',
  selectedMarkets: ['groseri', 'migros', 'a101', 'bim'],
  allergies: [],
  desiredFoods: ['any'],
  calorieGoal: 'balanced',
  proteinGoal: 'high',
  carbGoal: 'balanced',
  dietStyle: 'all',
  budgetAmount: 90,
  budgetType: 'per_meal',
  estimatedTargetCalories: 2200
};

export function App() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('user_meal_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_PROFILE,
          ...parsed,
          city: parsed.city || 'Adana',
          selectedMarkets: parsed.selectedMarkets?.length ? parsed.selectedMarkets : ['groseri', 'migros', 'a101', 'bim'],
          allergies: parsed.allergies || [],
          desiredFoods: parsed.desiredFoods || ['any']
        };
      }
    } catch (e) {
      console.warn('Could not read user profile', e);
    }
    return DEFAULT_PROFILE;
  });

  const [isOnboardingActive, setIsOnboardingActive] = useState<boolean>(() => {
    return !localStorage.getItem('onboarding_completed_v3') || !profile.name;
  });

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);
  const [mealsForSheets, setMealsForSheets] = useState<Meal[]>([]);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [mealForVideoAd, setMealForVideoAd] = useState<Meal | null>(null);
  const [unlockedMealIds, setUnlockedMealIds] = useState<string[]>([]);

  const [customMeals, setCustomMeals] = useState<Meal[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    maxBudget: profile.budgetAmount,
    onlyWithinBudget: false,
    category: 'all',
    macroFilter: 'all',
    sortBy: 'match',
    allergySafeOnly: false,
    desiredFoodFilter: 'all'
  });

  const handleCompleteOnboarding = (newProfile: UserProfile) => {
    setProfile(newProfile);
    setIsOnboardingActive(false);
  };

  const allMeals = useMemo(() => [...customMeals, ...MEALS_DATABASE], [customMeals]);
  const categories = useMemo(() => Array.from(new Set(MEALS_DATABASE.map(m => m.category))), []);

  if (isOnboardingActive) {
    return (
      <OnboardingFlow
        currentProfile={profile}
        onComplete={handleCompleteOnboarding}
        onCancel={() => setIsOnboardingActive(false)}
        canCancel={!!profile.name}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-stone-900 flex flex-col font-sans">
      <Header
        profile={profile}
        onEditProfile={() => setIsOnboardingActive(true)}
        onOpenAiRecipe={() => setIsAiModalOpen(true)}
        onExportAllSheets={() => setIsSheetsModalOpen(true)}
        onOpenProModal={() => setIsProModalOpen(true)}
      />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        <h2 className="text-2xl font-black mb-4">Afiyet olsun, {profile.name || 'Misafir'}!</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allMeals.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              profile={profile}
              onSelect={(m) => setSelectedMeal(m)}
              isUnlocked={true}
            />
          ))}
        </div>
      </main>
      <MealDetailModal meal={selectedMeal} onClose={() => setSelectedMeal(null)} profile={profile} />
      <AiRecipeModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} profile={profile} />
    </div>
  );
}

export default App;
