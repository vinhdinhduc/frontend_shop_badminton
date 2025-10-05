import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Loader2, RotateCcw, Flag } from "lucide-react";
import "./ChatbotWidget.scss";
import {
  clearChatService,
  createNewSessionChat,
  getHistoryService,
  sendMessageService,
} from "../../services/chatbotService";
import { useSelector } from "react-redux";

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { userInfo } = useSelector((state) => state.userLogin);

  useEffect(() => {
    const storedSessionId = localStorage.getItem("chatbot_session_id");
    if (storedSessionId) {
      setSessionId(storedSessionId);
      loadHistory(storedSessionId);
    } else {
      createNewSession();
    }
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setShowHint(true);
      setTimeout(() => {
        setShowHint(false);
      }, 4000);
    });
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (userInfo?.data?.user) {
      localStorage.removeItem("chatbot_session_id");
      setSessionId(null);
      setMessages([]);
      createNewSession();
    }
  }, [userInfo]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  //Focus input khi mở chat bot
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const createNewSession = async () => {
    try {
      const res = await createNewSessionChat();

      if (res && res.code === 0) {
        const newSessionId = res.data.session_id;
        setSessionId(newSessionId);
        localStorage.setItem("chatbot_session_id", newSessionId);
        setMessages([
          {
            role: "assistant",
            content: `Xin chào bạn ${userInfo?.data?.user?.fullName}! Tôi là trợ lý tư vấn vợt cầu lông.\n\nTôi có thể giúp bạn:\n• Chọn vợt phù hợp với trình độ\n• Tư vấn theo phong cách chơi\n• Gợi ý trong ngân sách của bạn\n\nBạn có kinh nghiệm chơi cầu lông chưa?`,
            created_at: new Date().toISOString(),
          },
        ]);
      }
    } catch (error) {
      console.error("Error creating session:", error);
      showErrorMessage("Không thể kết nối. Vui lòng thử lại sau.");
    }
  };
  const loadHistory = async (sid) => {
    try {
      const res = await getHistoryService(sid);

      if (res && res.code === 0 && res.data.length > 0) {
        setMessages(res.data);
      } else {
        setMessages([
          {
            role: "assistant",
            content: `Xin chào bạn ${userInfo?.data?.user?.fullName}! 👋 Tôi là trợ lý tư vấn vợt cầu lông.\n\nTôi có thể giúp bạn:\n• Chọn vợt phù hợp với trình độ\n• Tư vấn theo phong cách chơi\n• Gợi ý trong ngân sách của bạn\n\nBạn có kinh nghiệm chơi cầu lông chưa?`,
            created_at: new Date().toISOString(),
          },
        ]);
      }
    } catch (error) {
      console.error("Error loading history:", error);
    }
  };
  const showErrorMessage = (errorText) => {
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: errorText,
        created_at: new Date().toISOString(),
        isError: true,
      },
    ]);
  };

  const sendMessage = async (e) => {
    console.log("checkkkkk", inputMessage, sessionId, isLoading);

    e.preventDefault();
    if (!inputMessage.trim() || !sessionId || isLoading) {
      return;
    }

    const userMessageText = inputMessage.trim();
    const userMessage = {
      role: "user",
      content: userMessageText,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) =>
      Array.isArray(prev) ? [...prev, userMessage] : [userMessage]
    );
    console.log("messsage", messages);

    setInputMessage("");
    setIsLoading(true);

    try {
      const res = await sendMessageService(userMessageText, sessionId);
      console.log("Checkkkkkkkkk respom", res.data?.response);

      if (res && res.code === 0) {
        const assistantMessage = {
          role: "assistant",
          content: res.data?.response,
          created_at: new Date().toISOString(),
          recommended_products: res.data?.recommended_products || [],
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(res.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      showErrorMessage("Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = async () => {
    if (!sessionId) return;

    const confirmReset = window.confirm(
      "Bạn có chắc muốn bắt đầu cuộc trò chuyện mới?"
    );
    if (!confirmReset) return;

    try {
      await clearChatService(sessionId);

      localStorage.removeItem("chatbot_session_id");
      setMessages([]);
      setSessionId(null);
      createNewSession();
    } catch (error) {
      console.error("Error resetting chat:", error);
      showErrorMessage("Không thể reset chat. Vui lòng thử lại.");
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price) => {
    return Number(price).toLocaleString("vi-VN") + "đ";
  };
  return (
    <div className="chatbot-widget">
      {/* Toggle Button */}
      <button
        className={`chatbot-toggle ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Đóng chat" : "Mở chat"}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
      {showHint && !isOpen && (
        <div className="chatbot-hint">Bạn cần tư vấn sản phẩm không?</div>
      )}
      {/* Chat Window */}
      <div className={`chatbot-window ${isOpen ? "open" : ""}`}>
        {/* Header */}
        <div className="chatbot-header">
          <div className="header-info">
            <div className="avatar">
              <MessageCircle size={20} />
            </div>
            <div className="info">
              <h3>Tư vấn chọn vợt</h3>
              <span className="status">
                <span className="status-dot"></span>
                Trực tuyến
              </span>
            </div>
          </div>
          <button
            className="reset-button"
            onClick={resetChat}
            title="Bắt đầu cuộc trò chuyện mới"
            aria-label="Reset chat"
          >
            <RotateCcw size={18} />
          </button>
        </div>

        {/* Messages Container */}
        <div className="chatbot-messages">
          {messages?.map((msg, index) => (
            <div key={index} className={`message-wrapper ${msg.role}`}>
              <div className={`message ${msg.isError ? "error" : ""}`}>
                <div className="message-content">{msg.content}</div>

                {/* Recommended Products */}
                {msg.recommended_products &&
                  msg.recommended_products.length > 0 && (
                    <div className="recommended-products">
                      <p className="products-title">Sản phẩm đề xuất:</p>
                      <div className="products-list">
                        {msg.recommended_products
                          .slice(0, 3)
                          .map((product, i) => (
                            <a
                              key={i}
                              href={`/products/${product.slug}`}
                              className="product-card"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {product.images && product.images[0] && (
                                <div className="product-image">
                                  <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    loading="lazy"
                                  />
                                </div>
                              )}
                              <div className="product-info">
                                <h4 className="product-name">{product.name}</h4>
                                <p className="product-brand">{product.brand}</p>
                                <div className="product-footer">
                                  <span className="product-price">
                                    {formatPrice(
                                      product.discount_price || product.price
                                    )}
                                  </span>
                                  {product.rating > 0 && (
                                    <span className="product-rating">
                                      ⭐ {product.rating}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </a>
                          ))}
                      </div>
                    </div>
                  )}

                <span className="message-time">
                  {formatTime(msg.created_at)}
                </span>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="message-wrapper assistant">
              <div className="message loading-typing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form className="chatbot-input" onSubmit={sendMessage}>
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Nhập câu hỏi của bạn..."
            disabled={isLoading}
            maxLength={500}
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            aria-label="Gửi tin nhắn"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatbotWidget;
