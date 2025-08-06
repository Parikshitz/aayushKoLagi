"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Target,
  Calendar,
  Award,
  CheckCircle2,
  Edit3,
  Trash2,
} from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";

interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high";
  progress: number;
  target: number;
  unit: string;
  deadline: Date;
  milestones: Milestone[];
  createdAt: Date;
  completedAt?: Date;
}

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: Date;
}

interface GoalsSectionProps {
  onNotification: (notification: any) => void;
}

const categories = [
  "Career",
  "Health",
  "Learning",
  "Finance",
  "Personal",
  "Relationships",
  "Travel",
  "Creative",
];
const priorities = {
  low: { color: "from-green-500 to-emerald-500", label: "Low" },
  medium: { color: "from-yellow-500 to-orange-500", label: "Medium" },
  high: { color: "from-red-500 to-pink-500", label: "High" },
};

export default function GoalsSection({ onNotification }: GoalsSectionProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "Personal",
    priority: "medium" as "low" | "medium" | "high",
    target: 100,
    unit: "points",
    deadline: "",
  });

  useEffect(() => {
    const savedGoals = localStorage.getItem("goals");
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  const addGoal = () => {
    if (newGoal.title.trim()) {
      const goal: Goal = {
        id: Date.now().toString(),
        title: newGoal.title,
        description: newGoal.description,
        category: newGoal.category,
        priority: newGoal.priority,
        progress: 0,
        target: newGoal.target,
        unit: newGoal.unit,
        deadline: new Date(newGoal.deadline),
        milestones: [],
        createdAt: new Date(),
      };
      setGoals([...goals, goal]);
      setNewGoal({
        title: "",
        description: "",
        category: "Personal",
        priority: "medium",
        target: 100,
        unit: "points",
        deadline: "",
      });
      setShowAddForm(false);

      onNotification({
        type: "success",
        title: "Goal Added",
        message: `"${newGoal.title}" has been added to your goals`,
      });
    }
  };

  const updateProgress = (id: string, progress: number) => {
    setGoals(
      goals.map((goal) => {
        if (goal.id === id) {
          const updatedGoal = { ...goal, progress };
          if (progress >= goal.target && !goal.completedAt) {
            updatedGoal.completedAt = new Date();
            onNotification({
              type: "success",
              title: "🎉 Goal Completed!",
              message: `Congratulations! You've achieved "${goal.title}"`,
            });
          }
          return updatedGoal;
        }
        return goal;
      })
    );
  };

  const deleteGoal = (id: string) => {
    const goal = goals.find((g) => g.id === id);
    setGoals(goals.filter((g) => g.id !== id));
    if (goal) {
      onNotification({
        type: "info",
        title: "Goal Deleted",
        message: `"${goal.title}" has been removed`,
      });
    }
  };

  const getDaysUntilDeadline = (deadline: Date) => {
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressColor = (progress: number, target: number) => {
    const percentage = (progress / target) * 100;
    if (percentage >= 100) return "from-green-500 to-emerald-500";
    if (percentage >= 75) return "from-blue-500 to-cyan-500";
    if (percentage >= 50) return "from-yellow-500 to-orange-500";
    return "from-gray-500 to-slate-500";
  };

  const activeGoals = goals.filter((goal) => !goal.completedAt);
  const completedGoals = goals.filter((goal) => goal.completedAt);
  const overallProgress =
    goals.length > 0
      ? Math.round((completedGoals.length / goals.length) * 100)
      : 0;

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Goal Planner
          </h1>
          <p className="text-white/70">
            Set ambitious goals and track your journey to success
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <GlassPanel className="p-4 text-center" glow>
              <div className="text-2xl font-bold text-white mb-1">
                {goals.length}
              </div>
              <div className="text-white/70 text-sm">Total Goals</div>
            </GlassPanel>

            <GlassPanel className="p-4 text-center" glow>
              <div className="text-2xl font-bold text-white mb-1">
                {activeGoals.length}
              </div>
              <div className="text-white/70 text-sm">Active Goals</div>
            </GlassPanel>

            <GlassPanel className="p-4 text-center" glow>
              <div className="text-2xl font-bold text-white mb-1">
                {completedGoals.length}
              </div>
              <div className="text-white/70 text-sm">Completed</div>
            </GlassPanel>

            <GlassPanel className="p-4 text-center" glow>
              <div className="text-2xl font-bold text-white mb-1">
                {overallProgress}%
              </div>
              <div className="text-white/70 text-sm">Success Rate</div>
              <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                <div
                  className="bg-gradient-to-r from-indigo-400 to-purple-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </GlassPanel>
          </div>
        </motion.div>

        {/* Add Goal Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <GlassPanel className="p-6" glow>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-lg">Add New Goal</h3>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="p-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>

            <AnimatePresence>
              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={newGoal.title}
                      onChange={(e) =>
                        setNewGoal({ ...newGoal, title: e.target.value })
                      }
                      placeholder="Goal title..."
                      className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />

                    <select
                      value={newGoal.category}
                      onChange={(e) =>
                        setNewGoal({ ...newGoal, category: e.target.value })
                      }
                      className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat} className="bg-gray-800">
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <textarea
                    value={newGoal.description}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, description: e.target.value })
                    }
                    placeholder="Goal description..."
                    rows={3}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <select
                      value={newGoal.priority}
                      onChange={(e) =>
                        setNewGoal({
                          ...newGoal,
                          priority: e.target.value as any,
                        })
                      }
                      className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    >
                      {Object.entries(priorities).map(([key, { label }]) => (
                        <option key={key} value={key} className="bg-gray-800">
                          {label} Priority
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      value={newGoal.target}
                      onChange={(e) =>
                        setNewGoal({
                          ...newGoal,
                          target: Number(e.target.value),
                        })
                      }
                      placeholder="Target"
                      min="1"
                      className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />

                    <input
                      type="text"
                      value={newGoal.unit}
                      onChange={(e) =>
                        setNewGoal({ ...newGoal, unit: e.target.value })
                      }
                      placeholder="Unit (e.g., kg, hours)"
                      className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />

                    <input
                      type="date"
                      value={newGoal.deadline}
                      onChange={(e) =>
                        setNewGoal({ ...newGoal, deadline: e.target.value })
                      }
                      className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>

                  <button
                    onClick={addGoal}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white py-3 rounded-lg font-medium transition-all duration-200"
                  >
                    Add Goal
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassPanel>
        </motion.div>

        {/* Active Goals */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <GlassPanel className="p-6" glow>
            <h3 className="text-white font-semibold text-lg mb-6">
              Active Goals
            </h3>

            {activeGoals.length === 0 ? (
              <div className="text-center py-12">
                <Target className="text-white/30 mx-auto mb-4" size={48} />
                <p className="text-white/50">
                  No active goals. Set your first goal to get started!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence>
                  {activeGoals.map((goal) => {
                    const progressPercentage = Math.min(
                      (goal.progress / goal.target) * 100,
                      100
                    );
                    const daysLeft = getDaysUntilDeadline(goal.deadline);
                    const isOverdue = daysLeft < 0;

                    return (
                      <motion.div
                        key={goal.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="text-white font-medium text-lg mb-2">
                              {goal.title}
                            </h4>
                            <p className="text-white/70 text-sm mb-3">
                              {goal.description}
                            </p>

                            <div className="flex items-center gap-2 mb-3">
                              <span
                                className={`px-2 py-1 rounded-full text-xs bg-gradient-to-r ${
                                  priorities[goal.priority].color
                                } text-white`}
                              >
                                {priorities[goal.priority].label}
                              </span>
                              <span className="px-2 py-1 rounded-full text-xs bg-white/10 text-white/70">
                                {goal.category}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingGoal(goal)}
                              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => deleteGoal(goal.id)}
                              className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white/70 text-sm">
                                Progress
                              </span>
                              <span className="text-white text-sm font-medium">
                                {goal.progress} / {goal.target} {goal.unit}
                              </span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-3">
                              <div
                                className={`bg-gradient-to-r ${getProgressColor(
                                  goal.progress,
                                  goal.target
                                )} h-3 rounded-full transition-all duration-500`}
                                style={{ width: `${progressPercentage}%` }}
                              />
                            </div>
                            <div className="text-right mt-1">
                              <span className="text-white/70 text-xs">
                                {Math.round(progressPercentage)}% complete
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Calendar size={16} className="text-white/70" />
                              <span
                                className={`text-sm ${
                                  isOverdue ? "text-red-400" : "text-white/70"
                                }`}
                              >
                                {isOverdue
                                  ? `${Math.abs(daysLeft)} days overdue`
                                  : `${daysLeft} days left`}
                              </span>
                            </div>
                            <div className="text-white/70 text-xs">
                              {goal.deadline.toLocaleDateString()}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={goal.progress}
                              onChange={(e) =>
                                updateProgress(goal.id, Number(e.target.value))
                              }
                              min="0"
                              max={goal.target}
                              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm w-24"
                            />
                            <span className="text-white/70 text-sm">
                              / {goal.target} {goal.unit}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </GlassPanel>
        </motion.div>

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <GlassPanel className="p-6" glow>
              <h3 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
                <Award className="text-yellow-400" size={24} />
                Completed Goals
              </h3>

              <div className="space-y-3">
                {completedGoals.slice(-5).map((goal) => (
                  <div
                    key={goal.id}
                    className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="text-green-400" size={20} />
                      <div>
                        <div className="text-white font-medium">
                          {goal.title}
                        </div>
                        <div className="text-white/70 text-sm">
                          {goal.category}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 text-sm font-medium">
                        {goal.target} {goal.unit}
                      </div>
                      <div className="text-white/70 text-xs">
                        {goal.completedAt?.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </motion.div>
        )}
      </div>
    </div>
  );
}
