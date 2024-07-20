// EmailTemplate.js
const EmailTemplate = ({ first_name, email, mobile_number, password }) => {
    return `
      <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
        <h2 style="color: #333333;">Welcome to Our Platform, ${first_name}!</h2>
        <p>Thank you for registering as a supplier. Your account has been created successfully.</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mobile Number:</strong> ${mobile_number}</p>
        <p><strong>Password:</strong> ${password}</p>
        <p>You can now log in to your account and start managing your products and orders.</p>
        <p>Best regards,<br>Your Team</p>
      </div>
    `;
  };
  
  module.exports = EmailTemplate;
  
  