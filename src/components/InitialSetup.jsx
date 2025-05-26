import React, { useState } from "react";
import WeightForm from "./WeightForm";
import HeightForm from "./HeightForm";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import userStoreInstance from "../stores/UserStore";
import Cookies from "js-cookie";
import {
  Typography,
  InputNumber,
  Select,
  Button,
  Form,
  Space,
  message,
} from "antd";

const { Title, Paragraph } = Typography;
const { Option } = Select;

function InitialSetup() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId =
    userStoreInstance.getUser()?.userId || (storedUser ? storedUser._id : null);
  const googleId = Cookies.get("googleId");

  const [weightValue, setWeightValue] = useState("");
  const [heightValue, setHeightValue] = useState("");
  const [age, setAge] = useState(null);
  const [gender, setGender] = useState("");

  const navigate = useNavigate();

  const handleSave = async () => {
    if (!weightValue || !heightValue || !age || !gender) {
      message.error("Please fill in all fields before saving.");
      return;
    }

    const currentDate = new Date();

    const weights = [{ value: Number(weightValue), date: currentDate }];
    const heights = [{ value: Number(heightValue), date: currentDate }];

    try {
      const response = await axios.post(
        "http://localhost:5001/api/health/setup",
        {
          userId: userId || undefined,
          googleId: googleId || undefined,
          weights,
          heights,
          age,
          gender,
        }
      );

      message.success("Initial setup data saved successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving initial setup data:", error);
      message.error("Failed to save data. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: 450, margin: "40px auto" }}>
      <Title level={2} style={{ textAlign: "center" }}>
        Initial Setup
      </Title>

      <Paragraph>Please enter your initial weight.</Paragraph>
      <WeightForm
        existingWeight={weightValue}
        onChange={(value) => setWeightValue(value)}
        showSaveButton={false}
      />

      <Paragraph>Please enter your height.</Paragraph>
      <HeightForm
        existingHeight={heightValue}
        onChange={(value) => setHeightValue(value)}
        showSaveButton={false}
      />

      <Form layout="vertical">
        <Form.Item
          label="Age"
          required
          rules={[{ required: true, message: "Please input your age!" }]}
        >
          <InputNumber
            min={1}
            max={120}
            value={age}
            onChange={(value) => setAge(value)}
            style={{ width: "100%" }}
            placeholder="Enter your age"
          />
        </Form.Item>

        <Form.Item
          label="Gender"
          required
          rules={[{ required: true, message: "Please select your gender!" }]}
        >
          <Select
            placeholder="Select Gender"
            value={gender}
            onChange={(value) => setGender(value)}
          >
            <Option value="">Select Gender</Option>
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" block onClick={handleSave}>
            Save & Continue
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default InitialSetup;
