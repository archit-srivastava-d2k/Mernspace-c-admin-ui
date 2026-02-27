import { Card, Col, Form, Input, Row, Select } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../http/api";
import type { Category } from "../../Types";

type ProductsFilterProps = {
  children?: React.ReactNode;
};

const ProductsFilter = ({ children }: ProductsFilterProps) => {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories().then((res) => res.data),
  });

  return (
    <Card>
      <Row justify="space-between">
        <Col span={16}>
          <Row gutter={20}>
            <Col span={8}>
              <Form.Item name="q">
                <Input.Search allowClear placeholder="Search products" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="categoryId">
                <Select
                  style={{ width: "100%" }}
                  allowClear
                  placeholder="Select category"
                >
                  {(categories as Category[])?.map((cat) => (
                    <Select.Option key={cat._id} value={cat._id}>
                      {cat.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="isPublish">
                <Select
                  style={{ width: "100%" }}
                  allowClear
                  placeholder="Status"
                >
                  <Select.Option value="true">Published</Select.Option>
                  <Select.Option value="false">Draft</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Col>
        <Col span={8} style={{ display: "flex", justifyContent: "end" }}>
          {children}
        </Col>
      </Row>
    </Card>
  );
};

export default ProductsFilter;
