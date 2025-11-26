interface Vehicle {
    vehicle_id: string;
    plate: string;
    model: string;
    color: string;
}

interface User {
    user_id: string;
    password_hash: string;

    cpf: string;
    email: string;
    name: string;
    phone_number: string;
    is_admin: boolean;
    UFRGS_number: string;
    has_active_request: boolean;
}

export interface Request {
  solicitation_id: string;
  creation_date: string;
  is_approved: boolean;
  reviewed: boolean
  start_date: string;
  end_date: string;
  solicited_tag_type: string; 
  vehicle_id: string;
  user_id: string;
  vehicle: Vehicle;
  user: User;
}

export interface Tag {
  tag_id: string;
  tag_type: string;
}

export interface AdminTagCardProps {
  tag?: Request;
  showApproveButtons?: boolean;
  showEditOptions?: boolean;

  onApproveClick?: (tag: TAG) => void;
  onRejectClick?: (tag: TAG) => void;
  onEditClick?: (tag: TAG) => void;
  onDeleteClick?: (tag: TAG) => void;
  onDevolutionClick?: (tag: TAG) => void;

  selected?: boolean;
}
