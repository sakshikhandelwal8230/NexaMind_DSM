"use client"

import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CheckCircle, Clock, XCircle, AlertTriangle } from "lucide-react"

type TrustStatus = "verified" | "pending" | "unverified" | "suspended"

interface FacilityTrustBadgeProps {
  status: TrustStatus
  className?: string
}

const statusConfig = {
  verified: {
    label: "Verified",
    className: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
    description: "Facility has passed all verification checks",
  },
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
    description: "Verification in progress",
  },
  unverified: {
    label: "Unverified",
    className: "bg-gray-100 text-gray-800 border-gray-200",
    icon: AlertTriangle,
    description: "Facility requires verification",
  },
  suspended: {
    label: "Suspended",
    className: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
    description: "Facility access suspended",
  },
}

export function FacilityTrustBadge({ status, className }: FacilityTrustBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge className={`${config.className} ${className}`} variant="outline">
            <Icon className="h-3 w-3 mr-1" />
            {config.label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{config.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
