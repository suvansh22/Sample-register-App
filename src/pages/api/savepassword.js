import { apiHandler } from "@/components/helper/api-handler";
import { create } from "@/components/helper/usersRepo";

export default apiHandler({
  post: register,
});

async function register(req, res) {
  await create(req.body);
  return res
    .status(200)
    .json({ status: 200, message: "User saved successfully" });
}
