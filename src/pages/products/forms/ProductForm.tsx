import React from "react";
import {
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Switch,
  Upload,
  Typography,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getTenants } from "../../../http/api";
import type { Category, Tenant } from "../../../Types";
import { useAuthStore } from "../../../store";
import PriceConfigurationForm from "./PriceConfigurationForm";
import AttributeForm from "./AttributeForm";

type ProductFormProps = {
  isEditMode: boolean;
  onCategoryChange?: (category: Category | null) => void;
};

const ProductForm = ({ isEditMode, onCategoryChange }: ProductFormProps) => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";

  const form = Form.useFormInstance();
  const selectedCategoryId = Form.useWatch("categoryId", form);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories().then((res) => res.data),
  });

  const selectedCategory = React.useMemo(
    () =>
      (categories as Category[])?.find((c) => c._id === selectedCategoryId) ??
      null,
    [selectedCategoryId, categories],
  );

  React.useEffect(() => {
    onCategoryChange?.(selectedCategory ?? null);
  }, [selectedCategory, onCategoryChange]);

  const { data: tenants } = useQuery({
    queryKey: ["tenants"],
    queryFn: async () => {
      const res = await getTenants();
      const data = res.data;
      if (Array.isArray(data)) return data;
      if (data?.data && Array.isArray(data.data)) return data.data;
      return [];
    },
    enabled: isAdmin,
  });

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* Basic Info */}
          <Card title="Basic Info" bordered={false}>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label="Product name"
                  name="name"
                  rules={[
                    { required: true, message: "Please enter product name" },
                  ]}
                >
                  <Input size="large" placeholder="e.g. Margherita Pizza" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Category"
                  name="categoryId"
                  rules={[
                    { required: true, message: "Please select a category" },
                  ]}
                >
                  <Select size="large" placeholder="Select category" allowClear>
                    {(categories as Category[])?.map((cat) => (
                      <Select.Option key={cat._id} value={cat._id}>
                        {cat.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Description"
                  name="description"
                  rules={[
                    { required: true, message: "Please enter a description" },
                  ]}
                >
                  <Input.TextArea rows={3} placeholder="Product description" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Image */}
          <Card title="Product Image" bordered={false}>
            <Form.Item
              name="image"
              rules={[
                {
                  required: !isEditMode,
                  message: "Please upload a product image",
                },
              ]}
              valuePropName="fileList"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) return e;
                return e?.fileList;
              }}
            >
              <Upload
                listType="picture-card"
                maxCount={1}
                beforeUpload={() => false}
                accept="image/jpeg,image/png,image/webp"
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>
            <Typography.Text type="secondary">
              Accepted: JPEG, PNG, WebP — max 5 MB
            </Typography.Text>
          </Card>

          {/* Price Configuration (shown when category is selected) */}
          {selectedCategory && (
            <PriceConfigurationForm selectedCategory={selectedCategory} />
          )}

          {/* Attributes (shown when category is selected) */}
          {selectedCategory && (
            <AttributeForm selectedCategory={selectedCategory} />
          )}

          {/* Tenant (admin only) */}
          {isAdmin && (
            <Card title="Restaurant" bordered={false}>
              <Form.Item
                label="Restaurant (Tenant)"
                name="tenantId"
                rules={[
                  { required: true, message: "Please select a restaurant" },
                ]}
              >
                <Select size="large" placeholder="Select restaurant" allowClear>
                  {(tenants as Tenant[])?.map((t) => (
                    <Select.Option key={t.id} value={String(t.id)}>
                      {t.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Card>
          )}

          {/* Availability */}
          <Card title="Availability" bordered={false}>
            <Form.Item
              label="Published"
              name="isPublish"
              valuePropName="checked"
            >
              <Switch checkedChildren="Yes" unCheckedChildren="No" />
            </Form.Item>
          </Card>
        </Space>
      </Col>
    </Row>
  );
};

export default ProductForm;
