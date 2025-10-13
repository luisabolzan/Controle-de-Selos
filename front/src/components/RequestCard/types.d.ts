interface Request {
  solicitation_id: string;
  creation_date: string;
  is_approved: boolean;
  reviewed: boolean
  start_date: string;
  end_date: string;
  solicited_tag_type: string; 
  vehicle_id: string;
  user_id: string;
}

export interface RequestCardProps {
  request?: Request;
  showApproveButtons?: boolean;
  showEditOptions?: boolean;

  onApproveClick?: (ngo: NGO) => void;
  onRejectClick?: (ngo: NGO) => void;
  onEditClick?: (ngo: NGO) => void;
  onDeleteClick?: (ngo: NGO) => void;

  selected?: boolean;
}
