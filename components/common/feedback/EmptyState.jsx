import PropTypes from "prop-types";
import { Inbox } from "lucide-react";

export default function EmptyState({
  message = "데이터가 없습니다.",
  icon = <Inbox className="w-8 h-8 text-gray-300 mb-2" />,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 text-gray-400 text-sm ${className}`}
      role="status"
    >
      {icon}
      <p className="text-center">{message}</p>
    </div>
  );
}

EmptyState.propTypes = {
  message: PropTypes.string,
  icon: PropTypes.node,
  className: PropTypes.string,
};
