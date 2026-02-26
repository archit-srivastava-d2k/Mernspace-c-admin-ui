import { Card, Col, Form, Input, Row, Space, Select } from "antd";
import type { Tenant } from "../../../Types";
import { useQuery } from "@tanstack/react-query";
import { getTenants } from "../../../http/api";

type UserFormProps = {
  isEditMode: boolean;
};

const UserForm = ({ isEditMode }: UserFormProps) => {
  const selectedRole = Form.useWatch("role");

  const { data: tenants } = useQuery({
    queryKey: ["tenants"],
    queryFn: async () => {
      const response = await getTenants();
      const data = response.data;
      // Handle single object, array, or paginated response
      if (Array.isArray(data)) {
        return data;
      } else if (data?.data && Array.isArray(data.data)) {
        return data.data;
      } else if (data && typeof data === "object") {
        // Single object returned, wrap it in an array
        return [data];
      }
      return [];
    },
  });
  return (
    <Row>
      <Col span={24}>
        <Space direction="vertical" size="large">
          <Card title="Basic info" bordered={false}>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Please enter your first name!",
                    },
                  ]}
                  label="First name"
                  name="firstName"
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  rules={[
                    { required: true, message: "Please enter your last name!" },
                  ]}
                  label="Last name"
                  name="lastName"
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  rules={[
                    { required: true, message: "Please enter your email!" },
                    {
                      type: "email",
                      message: "Email is not valid",
                    },
                  ]}
                  label="Email"
                  name="email"
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {!isEditMode && (
            <Card title="Security info" bordered={false}>
              <Row gutter={20}>
                <Col span={12}>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: "Please input your password!",
                      },
                    ]}
                    label="Password"
                    name="password"
                  >
                    <Input size="large" type="password" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          )}

          <Card title="Role" bordered={false}>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  rules={[
                    { required: true, message: "Please enter your role!" },
                  ]}
                  label="Role"
                  name="role"
                >
                  <Select
                    size="large"
                    style={{ width: "100%" }}
                    allowClear={true}
                    placeholder="Select role"
                  >
                    <Select.Option value="admin">Admin</Select.Option>
                    <Select.Option value="manager">Manager</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              {selectedRole === "manager" && (
                <Col span={12}>
                  <Form.Item
                    label="Restaurant"
                    name="tenantId"
                    rules={[
                      {
                        required: true,
                        message: "Restaurant is required",
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      style={{ width: "100%" }}
                      allowClear={true}
                      placeholder="Select restaurant"
                    >
                      {tenants?.map((tenant: Tenant) => (
                        <Select.Option key={tenant.id} value={tenant.id}>
                          {tenant.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              )}
            </Row>
          </Card>
        </Space>
      </Col>
    </Row>
  );
};

export default UserForm;
