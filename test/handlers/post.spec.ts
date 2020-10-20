import handler from "../../api/graphql/handlers/post";

const mockCreatePost = jest.fn();
const context = {
  db: {
    post: {
      create: mockCreatePost
    }
  },
  userId: "35733704-1877-4937-8c39-fc18a7190b47"
};

const mockInputPost = { title: "hi", content: "hi" };

describe("createPost #post handler", (): void => {
  afterEach((): void => {
    mockCreatePost.mockClear();
  });

  it("should return success when create a post", async (): Promise<void> => {
    mockCreatePost.mockResolvedValue({ ...mockInputPost, userId: context.userId });

    const response = await handler.createPost(mockInputPost, context);

    expect(response).toHaveProperty("userId");
    expect(response).toHaveProperty("content");
    expect(response).toHaveProperty("title");
    expect(response.userId).toEqual("35733704-1877-4937-8c39-fc18a7190b47");

    expect(mockCreatePost).toHaveBeenCalled();
    expect(mockCreatePost).toHaveBeenCalledTimes(1);
    expect(mockCreatePost).toHaveBeenCalledWith({
      data: {
        ...mockInputPost,
        user: {
          connect: {
            id: context.userId
          }
        }
      }
    });
  });

  it("should return error if create post query failed", async (): Promise<void> => {
    try {
      mockCreatePost.mockRejectedValue("An error ocurred");
      await handler.createPost(mockInputPost, context);
    } catch (error) {
      expect(error).toEqual("An error ocurred");
      expect(mockCreatePost).toHaveBeenCalled();
      expect(mockCreatePost).toHaveBeenCalledTimes(1);
    }
  });
});