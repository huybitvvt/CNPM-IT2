import { API_BASE_URL } from "./constant";

async function login(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (response.ok) {
      const jwtData = result.data;

      localStorage.setItem("token", jwtData.token);
      localStorage.setItem("email", jwtData.email);
      localStorage.setItem("name", jwtData.name);
      localStorage.setItem("id", jwtData.id);
      localStorage.setItem("role", jwtData.role);

      return {
        success: true,
        token: jwtData.token,
        user: {
          id: jwtData.id,
          name: jwtData.name,
          email: jwtData.email,
          role: jwtData.role,
        },
      };
    } else {
      const message = result.message || result.error || "Login failed";
      return {
        success: false,
        error: message.includes("Full authentication")
          ? "Email hoặc mật khẩu không chính xác."
          : message,
      };
    }
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: "Network error. Please try again.",
    };
  }
}

async function register(formData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      return {
        success: true,
        message: "Registration successful",
      };
    } else {
      const data = await response.json();
      return {
        success: false,
        error: data.error || "Registration failed",
      };
    }
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: "Network error. Please try again.",
    };
  }
}

async function forgotPassword(email) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    return response.ok
      ? { success: true, message: data.message }
      : { success: false, error: data.message || data.error || "Không gửi được email đặt lại mật khẩu." };
  } catch (error) {
    console.error("Forgot password error:", error);
    return {
      success: false,
      error: "Không kết nối được máy chủ. Vui lòng thử lại.",
    };
  }
}

async function resetPassword(token, newPassword) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await response.json();
    return response.ok
      ? { success: true, message: data.message }
      : { success: false, error: data.message || data.error || "Không đặt lại được mật khẩu." };
  } catch (error) {
    console.error("Reset password error:", error);
    return {
      success: false,
      error: "Không kết nối được máy chủ. Vui lòng thử lại.",
    };
  }
}

async function getUserDetails(email) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/users/details?email=${email}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        data,
      };
    } else {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || "Failed to fetch user details",
      };
    }
  } catch (error) {
    console.error("Get user details error:", error);
    return {
      success: false,
      error: "Network error. Please try again.",
    };
  }
}

async function logout() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.ok) {
      console.log("Backend logout successful");
    }

  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.clear()
    window.location.href = "/login";
  }
}

function isAdminAuthenticated() {
  return !!localStorage.getItem("token") && localStorage.getItem("role") === "ROLE_ADMIN";
}

function isUserAuthenticated(){
  return !!localStorage.getItem("token") && localStorage.getItem("role") === "ROLE_USER";
}

function getCurrentUser() {
  return {
    token: localStorage.getItem("token"),
    id: localStorage.getItem("id"),
    name: localStorage.getItem("name"),
    email: localStorage.getItem("email"),
    role: localStorage.getItem("role"),
  };
}

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const authService = {
  login,
  register,
  forgotPassword,
  resetPassword,
  getUserDetails,
  logout,
  isAdminAuthenticated,
  isUserAuthenticated,
  getCurrentUser,
  getAuthHeader,
};
