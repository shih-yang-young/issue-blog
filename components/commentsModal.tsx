"use client";
import { EyeIcon } from "@/app/management/EyeIcon";
import { IssueModalProps } from "@/interfaces/IssueModalProps";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
  Link,
  Tooltip,
} from "@nextui-org/react";
import { Octokit } from "octokit";
import { useEffect, useState } from "react";

interface Comment {
  id: number;
  body: string;
}
interface ModalProps {
  issueNumber: number;
}
const CommentsModal: React.FC<ModalProps> = ({ issueNumber }) => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [comments, setComments] = useState<Comment[]>([]);
  useEffect(() => {
    const getComments = async () => {
      const octokit = new Octokit();
      try {
        const response = await octokit.request(
          `GET /repos/Shih-Yang-Young/issue-blog/issues/${issueNumber}/comments`,
          {
            headers: {
              "X-GitHub-Api-Version": "2022-11-28",
            },
          },
        );
        const commentsData = response.data.map((comment: Comment) => ({
          id: comment.id,
          body: comment.body,
        }));
        setComments(commentsData);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    if (isOpen) {
      getComments();
    }
  }, [isOpen, issueNumber]);

  return (
    <div>
      <Tooltip content="Comments">
        <span
          className="text-lg text-default-400 cursor-pointer active:opacity-50"
          onClick={onOpen}
        >
          <EyeIcon />
        </span>
      </Tooltip>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Issue Number {issueNumber} Comments
              </ModalHeader>
              <ModalBody>
                {comments.length > 0 ? (
                  <ul>
                    {comments.map((comment, index) => (
                      <li key={comment.id}>
                        ID: {comment.id} - {comment.body}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No comments found.</p>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="flat" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CommentsModal;
