import { Model } from 'mongoose';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { Issue, IssueDocument } from './schemas/issue.schema';
export declare class IssuesService {
    private issueModel;
    constructor(issueModel: Model<IssueDocument>);
    create(createIssueDto: CreateIssueDto): Promise<Issue>;
    findAll(): Promise<Issue[]>;
    findOne(id: string): Promise<Issue>;
    update(id: string, updateIssueDto: UpdateIssueDto): Promise<Issue>;
    remove(id: string): Promise<Issue>;
}
