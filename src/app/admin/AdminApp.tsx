"use client";

import { FormEvent, useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin, adminLogout } from "@/app/actions/admin";
import { upsertProduct } from "@/app/actions/products";
import { dismissPendingMedia } from "@/app/actions/pending-media";
import { uploadProductMedia } from "@/app/actions/upload";
import { addAdminReview } from "@/app/actions/reviews";
import { updateOrderStatus } from "@/app/actions/orders";
import { parseMediaList } from "@/lib/media";
import type { PendingMedia } from "@/lib/pending-media";
import { PRODUCT_CATEGORIES } from "@/data/categories";
import { FABRICS, OCCASIONS, WORK_TYPES, formatINR, type Saree } from "@/data/sarees";
import { ORDER_STATUSES } from "@/lib/order-status";
import type { StoreReview } from "@/lib/reviews";

type OrderRow = {
  orderId: string;
  phone: string;
  status: string;
  channel: string;
  subtotal: number;
  createdAt: string;
  items: { name: string; quantity: number }[];
};

type InquiryRow = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  businessName: string;
  productsInterested: string;
  estimatedQuantity: string;
  comments: string;
  createdAt: string;
};

type Tab = "products" | "reviews" | "orders" | "inquiries";

const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
const cloudinaryConsoleUrl = cloudinaryCloudName
  ? `https://console.cloudinary.com/console/c-${cloudinaryCloudName}/media_library/search?q=&view_mode=grid`
  : "https://console.cloudinary.com/";

const emptyForm = {
  id: "",
  name: "",
  description: "",
  fabric: "Kanjeevaram Silk",
  color: "",
  colorHex: "#800020",
  occasion: "Festive",
  workType: "Zari",
  category: "Sarees",
  price: "",
  originalPrice: "",
  images: "",
  videos: "",
  isBestseller: false,
  isNew: false,
  readyToShip: true,
  care: "Dry Clean Only",
};

const emptyReviewForm = {
  productId: "",
  author: "",
  rating: "5",
  text: "",
};

export function AdminLogin() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(adminLogin, null);

  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="font-serif text-3xl text-charcoal">Admin</h1>
      <p className="mt-2 text-sm text-muted">
        Sign in with an admin phone and the password from .env.local.
      </p>
      <form action={formAction} className="mt-8 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
            Phone
          </span>
          <input
            name="phone"
            type="tel"
            inputMode="numeric"
            required
            autoComplete="username"
            placeholder="10-digit mobile"
            className="h-12 w-full border border-border px-4 text-sm outline-none focus:border-burgundy"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
            Password
          </span>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="h-12 w-full border border-border px-4 text-sm outline-none focus:border-burgundy"
          />
        </label>
        {state && !state.ok && <p className="text-sm text-burgundy">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="h-12 w-full bg-burgundy text-sm font-semibold text-white"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

export function AdminDashboard({
  products,
  orders,
  inquiries,
  reviews,
  pendingMedia,
}: {
  products: Saree[];
  orders: OrderRow[];
  inquiries: InquiryRow[];
  reviews: StoreReview[];
  pendingMedia: PendingMedia[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("products");
  const [form, setForm] = useState(emptyForm);
  const [reviewForm, setReviewForm] = useState(emptyReviewForm);
  const [message, setMessage] = useState<string | null>(null);
  const [reviewMessage, setReviewMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const imageCount = parseMediaList(form.images).length;

  const grouped = useMemo(() => {
    return PRODUCT_CATEGORIES.map((category) => ({
      category,
      items: products.filter((p) => (p.category ?? "Sarees") === category),
    }));
  }, [products]);

  const otherProducts = useMemo(
    () =>
      products.filter(
        (p) => !(PRODUCT_CATEGORIES as readonly string[]).includes(p.category ?? "Sarees"),
      ),
    [products],
  );

  const edit = (saree: Saree) => {
    setForm({
      id: saree.id,
      name: saree.name,
      description: saree.description,
      fabric: saree.fabric,
      color: saree.color,
      colorHex: saree.colorHex,
      occasion: saree.occasion,
      workType: saree.workType,
      category: saree.category ?? "Sarees",
      price: String(saree.price),
      originalPrice: String(saree.originalPrice),
      images: saree.images.join("\n"),
      videos: (saree.videos ?? []).join("\n"),
      isBestseller: saree.isBestseller,
      isNew: saree.isNew,
      readyToShip: saree.readyToShip,
      care: saree.care,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const appendUrls = (field: "images" | "videos", urls: string[]) => {
    setForm((current) => {
      const existing = parseMediaList(current[field]);
      return { ...current, [field]: [...existing, ...urls].join("\n") };
    });
  };

  const uploadFiles = async (files: FileList | null, kind: "image" | "video") => {
    if (!files?.length) return;
    setUploading(kind);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const data = new FormData();
      data.set("file", file);
      data.set("kind", kind);
      const res = await uploadProductMedia(data);
      if (!res.ok) {
        setMessage(res.error);
        setUploading(null);
        return;
      }
      urls.push(res.url);
    }
    appendUrls(kind === "image" ? "images" : "videos", urls);
    setMessage(`Uploaded ${urls.length} ${kind}${urls.length === 1 ? "" : "s"}.`);
    setUploading(null);
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    const res = await upsertProduct({
      id: form.id || undefined,
      name: form.name,
      description: form.description,
      fabric: form.fabric,
      color: form.color,
      colorHex: form.colorHex,
      occasion: form.occasion,
      workType: form.workType,
      category: form.category,
      price: Number(form.price),
      originalPrice: Number(form.originalPrice || form.price),
      images: form.images,
      videos: form.videos,
      isBestseller: form.isBestseller,
      isNew: form.isNew,
      readyToShip: form.readyToShip,
      care: form.care,
    });
    if (!res.ok) {
      setMessage(res.error);
      return;
    }
    setMessage(form.id ? "Product updated." : `Product added (${res.id}).`);
    setForm(emptyForm);
    router.refresh();
  };

  const saveReview = async (e: FormEvent) => {
    e.preventDefault();
    const res = await addAdminReview({
      productId: reviewForm.productId,
      author: reviewForm.author,
      text: reviewForm.text,
      rating: Number(reviewForm.rating),
    });
    if (!res.ok) {
      setReviewMessage(res.error);
      return;
    }
    setReviewMessage("Review added.");
    setReviewForm(emptyReviewForm);
    router.refresh();
  };

  const productName = (id: string | null) =>
    id ? products.find((p) => p.id === id)?.name ?? id : "Site-wide default";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl text-charcoal">Admin</h1>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={cloudinaryConsoleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center border border-border px-4 text-sm"
          >
            Open Cloudinary
          </a>
          <form
            action={async () => {
              await adminLogout();
              router.refresh();
            }}
          >
            <button type="submit" className="h-11 border border-border px-4 text-sm">
              Sign out
            </button>
          </form>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {(
          [
            ["products", "Products"],
            ["reviews", "Reviews"],
            ["orders", "Orders"],
            ["inquiries", "B2B inquiries"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`h-11 px-4 text-sm ${
              tab === key ? "bg-burgundy text-white" : "border border-border"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "products" && (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <form onSubmit={save} className="space-y-3 border border-border bg-paper p-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em]">
              {form.id ? `Edit ${form.id}` : "Add product"}
            </h2>
            <details open className="border border-border px-3 py-2 text-sm">
              <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.14em] text-charcoal">
                How to upload in Cloudinary
              </summary>
              <ol className="mt-2 list-decimal space-y-1.5 pl-4 text-muted">
                <li>
                  Click{" "}
                  <a
                    href={cloudinaryConsoleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Open Cloudinary
                  </a>{" "}
                  and sign in.
                </li>
                <li>Go to Media Library.</li>
                <li>Upload → select images or videos (or drag-and-drop).</li>
                <li>
                  Click the asset → copy the <strong className="font-semibold text-charcoal">Secure URL</strong>{" "}
                  (starts with https://res.cloudinary.com/…).
                </li>
                <li>Paste into Images / Videos below (one URL per line).</li>
                <li>Save the product — use 2+ images so gallery arrows appear.</li>
              </ol>
              <p className="mt-2 text-xs text-muted">
                You can still use <strong className="font-medium text-charcoal">Upload to Cloudinary</strong>{" "}
                on this form if Cloudinary keys are set in the server env.
              </p>
            </details>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Name"
              required
              className="h-11 w-full border border-border px-3 text-sm"
            />
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Description"
              rows={3}
              className="w-full border border-border px-3 py-2 text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="h-11 border border-border px-3 text-sm"
              >
                {PRODUCT_CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <select
                value={form.fabric}
                onChange={(e) => setForm({ ...form, fabric: e.target.value })}
                className="h-11 border border-border px-3 text-sm"
              >
                {FABRICS.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
              <select
                value={form.occasion}
                onChange={(e) => setForm({ ...form, occasion: e.target.value })}
                className="h-11 border border-border px-3 text-sm"
              >
                {OCCASIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <select
                value={form.workType}
                onChange={(e) => setForm({ ...form, workType: e.target.value })}
                className="h-11 border border-border px-3 text-sm"
              >
                {WORK_TYPES.map((w) => (
                  <option key={w}>{w}</option>
                ))}
              </select>
              <input
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                placeholder="Color"
                className="h-11 border border-border px-3 text-sm"
              />
              <input
                value={form.colorHex}
                onChange={(e) => setForm({ ...form, colorHex: e.target.value })}
                placeholder="#hex"
                className="h-11 border border-border px-3 text-sm"
              />
              <input
                value={form.care}
                onChange={(e) => setForm({ ...form, care: e.target.value })}
                placeholder="Care"
                className="h-11 border border-border px-3 text-sm"
              />
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="Price"
                required
                className="h-11 border border-border px-3 text-sm"
              />
              <input
                type="number"
                value={form.originalPrice}
                onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                placeholder="Original price"
                className="h-11 border border-border px-3 text-sm"
              />
            </div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
              Images (one URL per line, or a JSON array)
            </label>
            <textarea
              value={form.images}
              onChange={(e) => setForm({ ...form, images: e.target.value })}
              placeholder={"https://res.cloudinary.com/...\nhttps://res.cloudinary.com/..."}
              rows={3}
              className="w-full border border-border px-3 py-2 text-sm"
            />
            <p className="text-xs text-muted">
              {imageCount} image{imageCount === 1 ? "" : "s"} — arrows show when there are 2+
            </p>
            <label className="block text-sm text-muted">
              Upload to Cloudinary (or local /uploads if Cloudinary env is empty)
              <input
                type="file"
                accept="image/*"
                multiple
                className="mt-1 block w-full text-sm"
                onChange={(e) => {
                  void uploadFiles(e.target.files, "image");
                  e.target.value = "";
                }}
              />
            </label>
            <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
              Videos (one URL per line)
            </label>
            <textarea
              value={form.videos}
              onChange={(e) => setForm({ ...form, videos: e.target.value })}
              placeholder="Videos (one URL per line)"
              rows={3}
              className="w-full border border-border px-3 py-2 text-sm"
            />
            <label className="block text-sm text-muted">
              Or upload videos
              <input
                type="file"
                accept="video/*"
                multiple
                className="mt-1 block w-full text-sm"
                onChange={(e) => {
                  void uploadFiles(e.target.files, "video");
                  e.target.value = "";
                }}
              />
            </label>
            {uploading && <p className="text-sm text-muted">Uploading {uploading}…</p>}
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isBestseller}
                onChange={(e) => setForm({ ...form, isBestseller: e.target.checked })}
              />
              Bestseller
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isNew}
                onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
              />
              New
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.readyToShip}
                onChange={(e) => setForm({ ...form, readyToShip: e.target.checked })}
              />
              Ready to ship
            </label>
            {message && <p className="text-sm text-burgundy">{message}</p>}
            <div className="flex gap-2">
              <button type="submit" className="h-11 flex-1 bg-burgundy text-sm text-white">
                {form.id ? "Update product" : "Add product"}
              </button>
              {form.id && (
                <button
                  type="button"
                  onClick={() => setForm(emptyForm)}
                  className="h-11 border border-border px-4 text-sm"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div>
            {pendingMedia.length > 0 && (
              <div className="mb-6 border border-border bg-paper p-4">
                <h3 className="text-xs font-semibold uppercase tracking-[0.14em]">
                  Pending Cloudinary uploads
                </h3>
                <p className="mt-1 text-xs text-muted">
                  Webhook files wait here until you add them to a product.
                </p>
                <ul className="mt-3 space-y-2">
                  {pendingMedia.map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-2 text-sm">
                      <span className="min-w-0 truncate text-xs">{item.resourceType} · {item.url}</span>
                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          className="h-9 border border-border px-2 text-xs"
                          onClick={() =>
                            appendUrls(item.resourceType === "video" ? "videos" : "images", [item.url])
                          }
                        >
                          Add to form
                        </button>
                        <button
                          type="button"
                          className="h-9 border border-border px-2 text-xs"
                          onClick={async () => {
                            await dismissPendingMedia(item.id);
                            router.refresh();
                          }}
                        >
                          Dismiss
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="text-sm text-muted">{products.length} products</p>
            {[...grouped, ...(otherProducts.length ? [{ category: "Other", items: otherProducts }] : [])].map(
              (group) => (
                <div key={group.category} className="mt-5">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-charcoal">
                    {group.category} ({group.items.length})
                  </h3>
                  <ul className="mt-2 divide-y divide-border border border-border bg-paper">
                    {group.items.map((p) => (
                      <li key={p.id} className="flex items-center justify-between gap-3 px-4 py-3">
                        <div>
                          <p className="text-sm font-medium">{p.name}</p>
                          <p className="text-xs text-muted">
                            {p.id} · {formatINR(p.price)} · {p.fabric}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => edit(p)}
                          className="h-10 border border-border px-3 text-xs font-semibold uppercase"
                        >
                          Edit
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            )}
          </div>
        </div>
      )}

      {tab === "reviews" && (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <form onSubmit={saveReview} className="space-y-3 border border-border bg-paper p-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em]">Add review</h2>
            <select
              value={reviewForm.productId}
              onChange={(e) => setReviewForm({ ...reviewForm, productId: e.target.value })}
              required
              className="h-11 w-full border border-border px-3 text-sm"
            >
              <option value="">Assign to a product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <input
              value={reviewForm.author}
              onChange={(e) => setReviewForm({ ...reviewForm, author: e.target.value })}
              placeholder="Reviewer name"
              required
              className="h-11 w-full border border-border px-3 text-sm"
            />
            <select
              value={reviewForm.rating}
              onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
              className="h-11 w-full border border-border px-3 text-sm"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} stars
                </option>
              ))}
            </select>
            <textarea
              value={reviewForm.text}
              onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
              placeholder="Comment"
              rows={4}
              required
              className="w-full border border-border px-3 py-2 text-sm"
            />
            {reviewMessage && <p className="text-sm text-burgundy">{reviewMessage}</p>}
            <button type="submit" className="h-11 w-full bg-burgundy text-sm text-white">
              Add review
            </button>
          </form>
          <ul className="space-y-3">
            {reviews.length === 0 && <p className="text-sm text-muted">No reviews yet.</p>}
            {reviews.map((review) => (
              <li key={review.id} className="border border-border bg-paper p-4 text-sm">
                <p className="font-medium">
                  {review.author} · {review.rating}/5
                </p>
                <p className="text-xs text-muted">
                  {productName(review.productId)} · {review.source}
                </p>
                <p className="mt-2 font-light">{review.text}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "orders" && (
        <ul className="mt-8 space-y-4">
          {orders.length === 0 && <p className="text-sm text-muted">No orders yet.</p>}
          {orders.map((order) => (
            <li key={order.orderId} className="border border-border bg-paper p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{order.orderId}</p>
                  <p className="text-xs text-muted">
                    +91 {order.phone} · {order.channel} · {formatINR(order.subtotal)}
                  </p>
                </div>
                <select
                  defaultValue={order.status}
                  onChange={async (e) => {
                    await updateOrderStatus(order.orderId, e.target.value);
                    router.refresh();
                  }}
                  className="h-11 border border-border px-3 text-sm"
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <p className="mt-2 text-sm text-muted">
                {order.items.map((i) => `${i.name} × ${i.quantity}`).join(", ")}
              </p>
            </li>
          ))}
        </ul>
      )}

      {tab === "inquiries" && (
        <ul className="mt-8 space-y-4">
          {inquiries.length === 0 && (
            <p className="text-sm text-muted">No B2B enquiries yet.</p>
          )}
          {inquiries.map((inq) => (
            <li key={inq.id} className="border border-border bg-paper p-4 text-sm">
              <p className="font-semibold">{inq.fullName}</p>
              <p className="text-muted">
                {inq.businessName} · {inq.email} · +91 {inq.phone}
              </p>
              <p className="mt-2">
                {inq.productsInterested}
                {inq.estimatedQuantity ? ` · Qty ${inq.estimatedQuantity}` : ""}
              </p>
              {inq.comments && <p className="mt-1 text-muted">{inq.comments}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
