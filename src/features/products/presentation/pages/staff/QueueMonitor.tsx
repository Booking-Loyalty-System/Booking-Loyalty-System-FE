import { useState, useEffect } from "react";
import { Layout } from "../../../../../shared/components/layout/Layout";
import {
  Car,
  Clock,
  Users,
  Activity,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Timer,
  ArrowRight,
  X,
  BarChart3,
  Zap,
  Target,
} from "lucide-react";
import { Button } from "../../../../../shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../../../shared/components/ui/dialog";
import { Progress } from "../../../../../shared/components/ui/progress";
import { Badge } from "../../../../../shared/components/ui/badge";

interface QueueVehicle {
  id: string;
  queueNumber: number;
  customerName: string;
  vehicle: string;
  servicePackage: string;
  estimatedDuration: number;
  checkInTime: string;
  waitingMinutes: number;
}

interface WashBay {
  id: string;
  name: string;
  status: "available" | "occupied" | "maintenance";
  currentVehicle?: string;
  servicePackage?: string;
  startTime?: string;
  finishETA?: string;
  remainingMinutes?: number;
  duration?: number;
  assignedStaff?: string;
  maintenanceETA?: string;
}

// Mock data
const initialQueue: QueueVehicle[] = [
  {
    id: "Q001",
    queueNumber: 1,
    customerName: "John Smith",
    vehicle: "Tesla Model 3",
    servicePackage: "Premium Wash",
    estimatedDuration: 15,
    checkInTime: "09:15",
    waitingMinutes: 8,
  },
  {
    id: "Q002",
    queueNumber: 2,
    customerName: "Sarah Johnson",
    vehicle: "BMW X5",
    servicePackage: "Ceramic Wash",
    estimatedDuration: 30,
    checkInTime: "09:18",
    waitingMinutes: 5,
  },
  {
    id: "Q003",
    queueNumber: 3,
    customerName: "Mike Chen",
    vehicle: "Honda Accord",
    servicePackage: "Basic Wash",
    estimatedDuration: 10,
    checkInTime: "09:20",
    waitingMinutes: 3,
  },
  {
    id: "Q004",
    queueNumber: 4,
    customerName: "Emily Davis",
    vehicle: "Toyota Camry",
    servicePackage: "Premium Wash",
    estimatedDuration: 15,
    checkInTime: "09:22",
    waitingMinutes: 1,
  },
];

const initialBays: WashBay[] = [
  {
    id: "BAY_A",
    name: "Bay A",
    status: "occupied",
    currentVehicle: "Mercedes C-Class",
    servicePackage: "Premium Wash",
    startTime: "09:20",
    finishETA: "09:35",
    remainingMinutes: 12,
    duration: 15,
    assignedStaff: "Michael Nguyen",
  },
  {
    id: "BAY_B",
    name: "Bay B",
    status: "available",
  },
  {
    id: "BAY_C",
    name: "Bay C",
    status: "maintenance",
    maintenanceETA: "10:30 AM",
  },
  {
    id: "BAY_D",
    name: "Bay D",
    status: "occupied",
    currentVehicle: "Ford F-150",
    servicePackage: "Basic Wash",
    startTime: "09:10",
    finishETA: "09:20",
    remainingMinutes: 3,
    duration: 10,
    assignedStaff: "David Le",
  },
];

export function QueueMonitor() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [queue, setQueue] = useState<QueueVehicle[]>(initialQueue);
  const [bays, setBays] = useState<WashBay[]>(initialBays);
  const [selectedBay, setSelectedBay] = useState<WashBay | null>(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate statistics
  const waitingVehicles = queue.length;
  const availableBays = bays.filter((b) => b.status === "available").length;
  const avgWaitTime =
    queue.length > 0
      ? Math.round(
          queue.reduce((sum, q) => sum + q.waitingMinutes, 0) / queue.length,
        )
      : 0;
  const completedToday = 47;
  const throughputPerHour = 12;
  const bayUtilization = 92;

  // Smart analytics
  const nextAvailableBay = bays
    .filter((b) => b.status === "occupied")
    .sort((a, b) => (a.remainingMinutes || 0) - (b.remainingMinutes || 0))[0];

  const longestWaitingCustomer = queue.sort(
    (a, b) => b.waitingMinutes - a.waitingMinutes,
  )[0];

  const handleAssignClick = (bay: WashBay) => {
    setSelectedBay(bay);
    setAssignModalOpen(true);
  };

  const handleAssignVehicle = (vehicle: QueueVehicle) => {
    if (!selectedBay) return;

    // Update bay status
    const now = new Date();
    const finishTime = new Date(
      now.getTime() + vehicle.estimatedDuration * 60000,
    );

    setBays((prev) =>
      prev.map((bay) =>
        bay.id === selectedBay.id
          ? {
              ...bay,
              status: "occupied" as const,
              currentVehicle: vehicle.vehicle,
              servicePackage: vehicle.servicePackage,
              startTime: now.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              finishETA: finishTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              remainingMinutes: vehicle.estimatedDuration,
              duration: vehicle.estimatedDuration,
              assignedStaff: "Michael Nguyen",
            }
          : bay,
      ),
    );

    // Remove from queue
    setQueue((prev) => prev.filter((q) => q.id !== vehicle.id));

    // Close modal
    setAssignModalOpen(false);
    setSelectedBay(null);
  };

  return (
    <Layout title="Queue Monitor" userName="Staff User" role="staff">
      <div className="space-y-6">
        {/* Header with Real-Time Clock */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  Operations Control Center
                </h1>
                <p className="text-blue-100">Real-time wash bay management</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold">
                {currentTime.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </p>
              <p className="text-blue-100 mt-1">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Waiting Vehicles */}
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-orange-500">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-orange-600" />
              <p className="text-xs text-gray-600 font-medium">
                Waiting Vehicles
              </p>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {waitingVehicles}
            </p>
          </div>

          {/* Available Bays */}
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <p className="text-xs text-gray-600 font-medium">
                Available Bays
              </p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{availableBays}</p>
          </div>

          {/* Average Wait Time */}
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <p className="text-xs text-gray-600 font-medium">Avg Wait Time</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {avgWaitTime}
              <span className="text-sm ml-1">min</span>
            </p>
          </div>

          {/* Completed Today */}
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-purple-500">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-purple-600" />
              <p className="text-xs text-gray-600 font-medium">
                Completed Today
              </p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{completedToday}</p>
          </div>

          {/* Throughput */}
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-cyan-500">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-cyan-600" />
              <p className="text-xs text-gray-600 font-medium">Throughput</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {throughputPerHour}
              <span className="text-sm ml-1">/hr</span>
            </p>
          </div>

          {/* Bay Utilization */}
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-indigo-500">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <p className="text-xs text-gray-600 font-medium">Utilization</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {bayUtilization}
              <span className="text-sm ml-1">%</span>
            </p>
          </div>
        </div>

        {/* Smart Analytics Panel */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-sm p-6 border border-indigo-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Smart Analytics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-xs text-gray-600 mb-1 font-medium">
                Next Bay Available
              </p>
              <p className="text-xl font-bold text-indigo-600">
                {nextAvailableBay
                  ? `${nextAvailableBay.name} in ${nextAvailableBay.remainingMinutes} min`
                  : "Bay Available Now"}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-xs text-gray-600 mb-1 font-medium">
                Longest Waiting Customer
              </p>
              <p className="text-xl font-bold text-orange-600">
                {longestWaitingCustomer
                  ? `${longestWaitingCustomer.customerName.split(" ")[0]}`
                  : "None"}
              </p>
              {longestWaitingCustomer && (
                <p className="text-sm text-gray-600">
                  Waiting {longestWaitingCustomer.waitingMinutes} minutes
                </p>
              )}
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-xs text-gray-600 mb-1 font-medium">
                Queue Clearance
              </p>
              <p className="text-xl font-bold text-green-600">11:45 AM</p>
              <p className="text-sm text-gray-600">All vehicles completed</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Waiting Queue */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Waiting Queue
                </h2>
              </div>
              <Badge
                variant="outline"
                className="bg-orange-50 text-orange-700 border-orange-200"
              >
                {waitingVehicles} waiting
              </Badge>
            </div>

            {queue.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">No vehicles waiting</p>
                <p className="text-sm text-gray-500">Queue is clear</p>
              </div>
            ) : (
              <div className="space-y-3">
                {queue.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="bg-gradient-to-r from-orange-50 to-white border-2 border-orange-200 rounded-lg p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-lg font-bold text-white">
                            #{vehicle.queueNumber}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">
                            {vehicle.customerName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {vehicle.vehicle}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-purple-100 text-purple-700 border-0">
                        {vehicle.servicePackage}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-gray-500 mb-1">Duration</p>
                        <p className="font-bold text-gray-900">
                          {vehicle.estimatedDuration} min
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-gray-500 mb-1">Checked In</p>
                        <p className="font-bold text-gray-900">
                          {vehicle.checkInTime}
                        </p>
                      </div>
                      <div className="bg-orange-50 rounded p-2">
                        <p className="text-orange-600 mb-1">Waiting</p>
                        <p className="font-bold text-orange-700">
                          {vehicle.waitingMinutes} min
                        </p>
                      </div>
                    </div>

                    {availableBays > 0 && (
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        size="sm"
                        onClick={() => {
                          const availBay = bays.find(
                            (b) => b.status === "available",
                          );
                          if (availBay) handleAssignClick(availBay);
                        }}
                      >
                        Assign to Bay
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Wash Bay Status */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Wash Bay Status
                </h2>
              </div>
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                {availableBays} available
              </Badge>
            </div>

            <div className="space-y-4">
              {bays.map((bay) => (
                <div
                  key={bay.id}
                  className={`rounded-xl p-5 border-2 transition-all ${
                    bay.status === "available"
                      ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 shadow-sm"
                      : bay.status === "occupied"
                        ? "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-300"
                        : "bg-gradient-to-br from-gray-50 to-slate-50 border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-md ${
                          bay.status === "available"
                            ? "bg-green-600"
                            : bay.status === "occupied"
                              ? "bg-orange-600"
                              : "bg-gray-600"
                        }`}
                      >
                        {bay.status === "available" ? (
                          <CheckCircle2 className="w-7 h-7 text-white" />
                        ) : bay.status === "occupied" ? (
                          <Car className="w-7 h-7 text-white" />
                        ) : (
                          <AlertCircle className="w-7 h-7 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {bay.name}
                        </h3>
                        <p
                          className={`text-sm font-bold uppercase tracking-wide ${
                            bay.status === "available"
                              ? "text-green-700"
                              : bay.status === "occupied"
                                ? "text-orange-700"
                                : "text-gray-700"
                          }`}
                        >
                          {bay.status}
                        </p>
                      </div>
                    </div>
                  </div>

                  {bay.status === "available" && (
                    <div className="mt-4">
                      <p className="text-sm text-green-700 font-medium mb-3 text-center">
                        Ready for next vehicle
                      </p>
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700 shadow-md"
                        size="lg"
                        onClick={() => handleAssignClick(bay)}
                        disabled={queue.length === 0}
                      >
                        <Car className="w-5 h-5 mr-2" />
                        Assign Vehicle
                      </Button>
                    </div>
                  )}

                  {bay.status === "occupied" && (
                    <div className="space-y-3">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Vehicle
                            </p>
                            <p className="font-bold text-gray-900 text-sm">
                              {bay.currentVehicle}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Service
                            </p>
                            <Badge className="bg-purple-100 text-purple-700 border-0 text-xs">
                              {bay.servicePackage}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Started
                            </p>
                            <p className="font-bold text-gray-900 text-sm">
                              {bay.startTime}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Finish ETA
                            </p>
                            <p className="font-bold text-gray-900 text-sm">
                              {bay.finishETA}
                            </p>
                          </div>
                        </div>

                        <div className="bg-orange-50 rounded-lg p-3 mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Timer className="w-4 h-4 text-orange-600" />
                              <span className="text-sm font-bold text-orange-900">
                                Time Remaining
                              </span>
                            </div>
                            <span className="text-lg font-bold text-orange-700">
                              {bay.remainingMinutes} min
                            </span>
                          </div>
                          <Progress
                            value={
                              ((bay.duration! - bay.remainingMinutes!) /
                                bay.duration!) *
                              100
                            }
                            className="h-2"
                          />
                          <p className="text-xs text-gray-600 mt-2">
                            {Math.round(
                              ((bay.duration! - bay.remainingMinutes!) /
                                bay.duration!) *
                                100,
                            )}
                            % complete
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>Staff: {bay.assignedStaff}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {bay.status === "maintenance" && (
                    <div className="mt-4">
                      <div className="bg-white rounded-lg p-4 text-center">
                        <AlertCircle className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                        <p className="font-bold text-gray-900 mb-1">
                          Unavailable
                        </p>
                        <p className="text-sm text-gray-600">
                          Expected Return: {bay.maintenanceETA}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bay Schedule Timeline */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Bay Schedule</h2>
          </div>

          <div className="space-y-4">
            {bays.map((bay) => (
              <div key={bay.id} className="flex items-center gap-4">
                <div className="w-24 font-bold text-gray-900">{bay.name}</div>
                <div className="flex-1">
                  {bay.status === "occupied" ? (
                    <div className="relative">
                      <div className="h-8 bg-gradient-to-r from-orange-500 to-orange-400 rounded-lg flex items-center px-4 text-white font-medium text-sm shadow-md">
                        {bay.startTime} → {bay.finishETA}
                      </div>
                    </div>
                  ) : bay.status === "available" ? (
                    <div className="h-8 bg-green-100 border-2 border-green-300 border-dashed rounded-lg flex items-center justify-center text-green-700 font-medium text-sm">
                      Available
                    </div>
                  ) : (
                    <div className="h-8 bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center text-gray-600 font-medium text-sm">
                      Maintenance until {bay.maintenanceETA}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Assignment Modal */}
      <Dialog open={assignModalOpen} onOpenChange={setAssignModalOpen}>
        <DialogContent className="max-w-2xl bg-white shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Assign Vehicle to Wash Bay
            </DialogTitle>
            <DialogDescription>
              Select a waiting vehicle to assign to {selectedBay?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {queue.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No vehicles in queue</p>
              </div>
            ) : (
              queue.map((vehicle) => (
                <button
                  key={vehicle.id}
                  onClick={() => handleAssignVehicle(vehicle)}
                  className="w-full bg-gradient-to-r from-blue-50 to-white border-2 border-blue-200 rounded-lg p-4 hover:shadow-lg hover:border-blue-400 transition-all text-left"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-bold text-white">
                          #{vehicle.queueNumber}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">
                          {vehicle.customerName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {vehicle.vehicle}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-blue-600" />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-purple-50 rounded p-2">
                      <p className="text-purple-600 mb-1">Service</p>
                      <p className="font-bold text-purple-900">
                        {vehicle.servicePackage}
                      </p>
                    </div>
                    <div className="bg-blue-50 rounded p-2">
                      <p className="text-blue-600 mb-1">Duration</p>
                      <p className="font-bold text-blue-900">
                        {vehicle.estimatedDuration} min
                      </p>
                    </div>
                    <div className="bg-orange-50 rounded p-2">
                      <p className="text-orange-600 mb-1">Waiting</p>
                      <p className="font-bold text-orange-900">
                        {vehicle.waitingMinutes} min
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setAssignModalOpen(false)}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
