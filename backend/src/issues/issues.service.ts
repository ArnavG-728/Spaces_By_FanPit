import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { Issue, IssueDocument } from './schemas/issue.schema';

@Injectable()
export class IssuesService {
  constructor(@InjectModel(Issue.name) private issueModel: Model<IssueDocument>) {}

  async create(createIssueDto: CreateIssueDto): Promise<Issue> {
    const createdIssue = new this.issueModel(createIssueDto);
    return createdIssue.save();
  }

  async findAll(): Promise<Issue[]> {
    return this.issueModel.find().populate('space').populate('reportedBy').populate('assignedTo').exec();
  }

  async findOne(id: string): Promise<Issue> {
    const issue = await this.issueModel.findById(id).populate('space').populate('reportedBy').populate('assignedTo').exec();
    if (!issue) {
      throw new NotFoundException(`Issue with ID "${id}" not found`);
    }
    return issue;
  }

  async update(id: string, updateIssueDto: UpdateIssueDto): Promise<Issue> {
    const existingIssue = await this.issueModel.findByIdAndUpdate(id, updateIssueDto, { new: true }).exec();
    if (!existingIssue) {
      throw new NotFoundException(`Issue with ID "${id}" not found`);
    }
    return existingIssue;
  }

  async remove(id: string): Promise<Issue> {
    const deletedIssue = await this.issueModel.findByIdAndDelete(id).exec();
    if (!deletedIssue) {
      throw new NotFoundException(`Issue with ID "${id}" not found`);
    }
    return deletedIssue;
  }
}
