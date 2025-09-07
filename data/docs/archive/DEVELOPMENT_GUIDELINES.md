# Development Guidelines - Preserving Functionality

## Overview
This document provides clear guidelines for preserving essential functionality during refactoring and development. It ensures that important TODO items and future implementation requirements are not accidentally deleted.

## 🛡️ Critical Preservation Rules

### ✅ DO NOT DELETE (Essential Functionality)
- **Functions marked with `// TODO: Implement`** - These are required features
- **Components with placeholder implementations** - These are part of the core UI
- **Hooks with incomplete functionality** - These provide essential state management
- **API endpoints returning mock data** - These are placeholders for real data sources
- **Any code marked with `FUTURE:` comments** - These are planned enhancements

### ❌ SAFE TO REMOVE (Only These)
- **Unused imports and variables** - Only if they have no TODO markers
- **Duplicate implementations** - Only if the original is preserved
- **Dead code without TODO markers** - Only if it's truly unused

## 📋 Critical Files to Preserve

### Frontend Core Files
```
modules/grow/frontend/GrowPage.tsx
modules/grow/frontend/components/GrowViewManager.tsx
modules/grow/frontend/hooks/useMapEvents.ts
modules/grow/frontend/components/PropertiesFab.tsx
modules/grow/frontend/components/SuburbToolkit.tsx
```

### Backend Core Files
```
modules/grow/backend/data/fetch.py
modules/grow/backend/scoring/logic/scoring_algorithms.py
modules/grow/backend/scoring/main.py
```

## 🔍 Pre-Refactoring Checklist

Before making any changes, run these commands:

```bash
# 1. Generate current TODO preservation list
node scripts/preserve-todos.js --generate

# 2. List all current TODOs
node scripts/preserve-todos.js --list

# 3. Check for potentially deleted TODOs
node scripts/preserve-todos.js --check
```

## 📊 Current TODO Statistics

- **Total TODOs**: 408 items
- **High Priority**: 21 items (Critical Files)
- **Medium Priority**: 65 items (Future Implementations)
- **Low Priority**: 203 items (Documentation and Infrastructure)

## 🎯 High Priority Implementation Areas

### 1. Property Data Integration
- **Location**: `modules/grow/frontend/components/GrowViewManager.tsx`
- **Missing**: Real property data fetching and display
- **Impact**: Core functionality for property discovery

### 2. Map Interaction Enhancement
- **Location**: `modules/grow/frontend/hooks/useMapEvents.ts`
- **Missing**: Proper point-in-polygon detection
- **Impact**: Accurate suburb selection and highlighting

### 3. Compare Functionality
- **Location**: `modules/grow/frontend/components/GrowViewManager.tsx`
- **Missing**: Item removal and reordering in compare view
- **Impact**: Core comparison feature

### 4. Property Management
- **Location**: `modules/grow/frontend/GrowPage.tsx`
- **Missing**: Save and compare property functionality
- **Impact**: User engagement and data persistence

### 5. Suburb Navigation
- **Location**: `modules/grow/frontend/components/GrowViewManager.tsx`
- **Missing**: Center on map and highlight polygons
- **Impact**: Map interaction and user experience

## 🔧 Implementation Guidelines

### When Implementing TODOs

1. **Preserve the TODO comment** - Add implementation below it
2. **Add FUTURE notes** - Document next steps or enhancements
3. **Update documentation** - Reflect changes in relevant docs
4. **Test thoroughly** - Ensure functionality works as expected

### Example Implementation Pattern

```typescript
// TODO: Implement save property functionality
// FUTURE: Add to user favorites/watchlist with persistence
const handleSaveProperty = (propertyId: string) => {
  // Implementation here
  saveToUserFavorites(propertyId);
  showSuccessMessage('Property saved to favorites');
};
```

## 🚨 Warning Signs

### Red Flags During Refactoring
- **Large number of TODO deletions** - Review carefully
- **Removal of placeholder functions** - Check if they're needed
- **Deletion of mock data** - Ensure real data is available
- **Removal of component props** - Verify they're not used elsewhere

### Safe Refactoring Indicators
- **Only unused imports removed** - Safe
- **Duplicate code consolidated** - Safe if original preserved
- **Dead code removal** - Safe if no TODO markers
- **Performance optimizations** - Safe if functionality preserved

## 📝 Documentation Requirements

### When Making Changes
1. **Update TODO comments** - Mark as implemented or update status
2. **Add FUTURE notes** - Document next enhancement steps
3. **Update analysis docs** - Reflect current implementation status
4. **Preserve examples** - Keep code examples for future reference

### Required Documentation Updates
- `data/docs/MISSING_FUNCTIONALITY_ANALYSIS.md`
- `data/docs/EPIC_IMPLEMENTATION_STATUS.md`
- `data/docs/TODO_PRESERVATION_LIST.json`

## 🛠️ Tools and Scripts

### Preservation Scripts
```bash
# Generate preservation list
node scripts/preserve-todos.js --generate

# List all TODOs
node scripts/preserve-todos.js --list

# Check for deleted TODOs
node scripts/preserve-todos.js --check
```

### Git Commands for Safety
```bash
# Check git history for TODO changes
git log -S "TODO:" --oneline

# See what TODOs were in a specific commit
git show <commit-hash> | grep -A 5 -B 5 "TODO:"

# Check for TODO deletions in recent commits
git log --oneline -p | grep -A 10 -B 10 "TODO:"
```

## 🎯 Success Metrics

### Preservation Success Indicators
- ✅ No critical TODO items accidentally deleted
- ✅ All placeholder functions preserved or properly implemented
- ✅ Mock data replaced with real implementations
- ✅ Documentation updated to reflect current status
- ✅ Build passes without errors

### Implementation Success Indicators
- ✅ Core functionality working as expected
- ✅ User experience improved
- ✅ Performance maintained or improved
- ✅ Code quality enhanced
- ✅ Tests passing

## 🚀 Future Development Roadmap

### Phase 1: Core Data Integration
1. Implement real property data fetching
2. Connect to backend APIs
3. Replace mock data with real sources

### Phase 2: Enhanced Interactions
1. Implement proper map interactions
2. Add advanced comparison features
3. Enhance property management

### Phase 3: Advanced Features
1. Implement AI-powered recommendations
2. Add comprehensive error tracking
3. Enhance user feedback systems

## 📞 Support and Questions

### When in Doubt
1. **Check the analysis docs** - `data/docs/MISSING_FUNCTIONALITY_ANALYSIS.md`
2. **Run the preservation script** - `node scripts/preserve-todos.js --list`
3. **Review git history** - Check what was previously implemented
4. **Consult the spec** - `data/docs/grow-spec.md`

### Emergency Recovery
If critical functionality is accidentally deleted:
1. **Check git history** - `git log -S "TODO:" --oneline`
2. **Restore from backup** - Use git revert or checkout
3. **Regenerate preservation list** - `node scripts/preserve-todos.js --generate`
4. **Update documentation** - Reflect the recovery

## 🏁 Conclusion

The current implementation provides a solid foundation with all core UI components and state management in place. The missing functionality is primarily related to data integration and advanced features.

**Key Principle**: When in doubt, preserve rather than delete. It's better to keep placeholder functionality than to accidentally remove essential features.

**Remember**: Every TODO comment represents planned functionality that users expect. Treat them as requirements, not suggestions. 