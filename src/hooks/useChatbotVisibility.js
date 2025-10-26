import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const useChatbotVisibility = () => {
  const location = useLocation();

  // Ẩn chatbot ở các trang này
  const hiddenPaths = ["/admin", "/auth", "/checkout", "/cart"];

  const isAdminPage = hiddenPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  return !isAdminPage;
};

export default useChatbotVisibility;
