import React from "react";
import {
  Breadcrumb,
  Button,
  Drawer,
  Flex,
  Form,
  Image,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
  theme,
} from "antd";
import {
  RightOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createProduct, getProducts, updateProduct } from "../../http/api";
import type { Category, FieldData, Product } from "../../Types";
import { useAuthStore } from "../../store";
import ProductsFilter from "./ProductsFilter";
import ProductForm from "./forms/ProductForm";
import { PER_PAGE } from "../../constants";
import { debounce } from "lodash";

const Products = () => {
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const {
    token: { colorBgLayout },
  } = theme.useToken();

  const [queryParams, setQueryParams] = React.useState({
    perPage: PER_PAGE,
    currentPage: 1,
  });

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(
    null,
  );
  const [selectedCategory, setSelectedCategory] =
    React.useState<Category | null>(null);

  const {
    data: productsData,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["products", queryParams],
    queryFn: () => {
      const filteredParams = Object.fromEntries(
        Object.entries(queryParams).filter(([, v]) => !!v),
      );
      const queryString = new URLSearchParams(
        filteredParams as unknown as Record<string, string>,
      ).toString();
      return getProducts(queryString).then((res) => res.data);
    },
    placeholderData: keepPreviousData,
  });

  const buildFormData = (values: Record<string, unknown>) => {
    const formData = new FormData();
    formData.append("name", values.name as string);
    formData.append("description", values.description as string);
    formData.append("categoryId", values.categoryId as string);
    formData.append("isPublish", String(values.isPublish ?? false));

    // tenantId — admin selects, manager uses their own
    if (user?.role === "admin") {
      formData.append("tenantId", values.tenantId as string);
    } else if (user?.tenant?.id) {
      formData.append("tenantId", String(user.tenant.id));
    }

    // Image: extract File from Ant Design Upload fileList
    const fileList = values.image as { originFileObj?: File }[];
    if (fileList?.length && fileList[0].originFileObj) {
      formData.append("image", fileList[0].originFileObj);
    }

    // priceConfiguration: rebuild with priceType from selected category
    const rawPriceConfig = (values.priceConfiguration ?? {}) as Record<
      string,
      Record<string, number>
    >;
    const builtPriceConfig: Record<
      string,
      { priceType: string; availableOptions: Record<string, number> }
    > = {};
    if (selectedCategory) {
      for (const [key, options] of Object.entries(rawPriceConfig)) {
        builtPriceConfig[key] = {
          priceType:
            selectedCategory.priceConfiguration[key]?.priceType ?? "base",
          availableOptions: options,
        };
      }
    }
    formData.append("priceConfiguration", JSON.stringify(builtPriceConfig));

    // attributes: convert { name: value, ... } object to [{ name, value }] array
    const rawAttributes = (values.attributes ?? {}) as Record<
      string,
      string | boolean
    >;
    const builtAttributes = Object.entries(rawAttributes).map(
      ([name, value]) => ({ name, value }),
    );
    formData.append("attributes", JSON.stringify(builtAttributes));

    return formData;
  };

  const { mutate: createProductMutate } = useMutation({
    mutationKey: ["create-product"],
    mutationFn: (data: FormData) => createProduct(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const { mutate: updateProductMutate } = useMutation({
    mutationKey: ["update-product"],
    mutationFn: (data: FormData) =>
      updateProduct(data, editingProduct!._id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const onHandleSubmit = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    const formData = buildFormData(values);

    if (editingProduct) {
      await updateProductMutate(formData);
    } else {
      await createProductMutate(formData);
    }

    form.resetFields();
    setEditingProduct(null);
    setSelectedCategory(null);
    setDrawerOpen(false);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    form.setFieldsValue({
      name: product.name,
      description: product.description,
      categoryId: product.categoryId,
      tenantId: product.tenantId,
      isPublish: product.isPublish,
    });
    setDrawerOpen(true);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Product) => (
        <Flex align="center" gap={12}>
          <Image
            src={record.image}
            width={40}
            height={40}
            style={{ objectFit: "cover", borderRadius: 4 }}
            preview={false}
            fallback="https://placehold.co/40x40"
          />
          <Typography.Text strong>{text}</Typography.Text>
        </Flex>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "isPublish",
      key: "isPublish",
      render: (isPublish: boolean) =>
        isPublish ? (
          <Tag color="green">Published</Tag>
        ) : (
          <Tag color="orange">Draft</Tag>
        ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: string, record: Product) => (
        <Button type="link" onClick={() => handleEditProduct(record)}>
          Edit
        </Button>
      ),
    },
  ];

  const debouncedQUpdate = React.useMemo(
    () =>
      debounce((value: string | undefined) => {
        setQueryParams((prev) => ({ ...prev, q: value, currentPage: 1 }));
      }, 500),
    [],
  );

  const onFilterChange = (changedFields: FieldData[]) => {
    const changedFilterFields = changedFields
      .map((item) => ({ [item.name[0]]: item.value }))
      .reduce((acc, item) => ({ ...acc, ...item }), {});

    if ("q" in changedFilterFields) {
      debouncedQUpdate(changedFilterFields.q);
    } else {
      setQueryParams((prev) => ({
        ...prev,
        ...changedFilterFields,
        currentPage: 1,
      }));
    }
  };

  React.useEffect(() => {
    return () => debouncedQUpdate.cancel();
  }, [debouncedQUpdate]);

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Flex justify="space-between">
        <Breadcrumb
          separator={<RightOutlined />}
          items={[
            { title: <Link to="/">Dashboard</Link> },
            { title: "Products" },
          ]}
        />
        {isFetching && (
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        )}
        {isError && (
          <Typography.Text type="danger">{error.message}</Typography.Text>
        )}
      </Flex>

      <Form form={filterForm} onFieldsChange={onFilterChange}>
        <ProductsFilter>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setDrawerOpen(true)}
          >
            Add Product
          </Button>
        </ProductsFilter>
      </Form>

      <Table
        columns={columns}
        dataSource={productsData?.data}
        rowKey="_id"
        pagination={{
          total: productsData?.total,
          pageSize: queryParams.perPage,
          current: queryParams.currentPage,
          onChange: (page) =>
            setQueryParams((prev) => ({ ...prev, currentPage: page })),
        }}
      />

      <Drawer
        title={editingProduct ? "Update Product" : "Add Product"}
        width={720}
        styles={{ body: { backgroundColor: colorBgLayout } }}
        destroyOnClose
        open={drawerOpen}
        onClose={() => {
          form.resetFields();
          setEditingProduct(null);
          setSelectedCategory(null);
          setDrawerOpen(false);
        }}
        extra={
          <Space>
            <Button
              onClick={() => {
                form.resetFields();
                setEditingProduct(null);
                setSelectedCategory(null);
                setDrawerOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button type="primary" onClick={onHandleSubmit}>
              Submit
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" form={form}>
          <ProductForm
            isEditMode={!!editingProduct}
            onCategoryChange={setSelectedCategory}
          />
        </Form>
      </Drawer>
    </Space>
  );
};

export default Products;
