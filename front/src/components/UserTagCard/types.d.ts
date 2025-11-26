interface Vehicle {
    vehicle_id: string;
    plate: string;
    model: string;
    color: string;
}

interface Driver{
  name: string;
  surname: string;
  license_number: string;
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
  tag_id: int
  tag_type: string; 
  end_date: datetime | null 
  plate: string
  username: string
}

export interface UserTagCardProps {
  tag?: Request;
  showApproveButtons?: boolean;
  showEditOptions?: boolean;

  onApproveClick?: (ngo: NGO) => void;
  onRejectClick?: (ngo: NGO) => void;
  onEditClick?: (ngo: NGO) => void;
  onDeleteClick?: (ngo: NGO) => void;

  selected?: boolean;
}
